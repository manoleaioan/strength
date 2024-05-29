const setSupersetWithTheNext = (exerciseList, index) => {
    const currentExercise = exerciseList[index];
    const nextExercise = exerciseList[index + 1];

    let isNextSuperset = nextExercise?.superset?.length > 0;

    if (!nextExercise) return;

    for (let i = 0; i < exerciseList.length; i++) {
        const e = exerciseList[i];

        if (!e || (e._id == nextExercise._id && !isNextSuperset)) {
            exerciseList[i] = null;
        } else if (e._id === currentExercise._id) {
            if (e.superset?.length > 0) {
                if (isNextSuperset) {
                    // If the current and the next exercise is already in a superset, combine them
                    e.superset = [...e.superset, ...nextExercise.superset];
                    exerciseList[i + 1] = null;
                } else {
                    // If the current exercise is already in a superset, just add the next exercise to its superset
                    e.superset = [...e.superset, { _id: nextExercise._id, exId: nextExercise.exId, records: nextExercise.records }];
                }
            } else {
                if (isNextSuperset) {
                    // If the next exercise is already in a superset, move the current exercise to that superset
                    nextExercise.superset = [{ _id: e._id, exId: e.exId, records: e.records }, ...nextExercise.superset]
                    exerciseList[i] = null;
                } else {
                    // Create a new superset with the current and next exercises
                    e.superset = [
                        { _id: currentExercise._id, exId: currentExercise.exId, records: currentExercise.records },
                        { _id: nextExercise._id, exId: nextExercise.exId, records: nextExercise.records }
                    ];
                    e.exId = undefined;
                    e._id = undefined;
                }
            }
        }
    }

    return exerciseList.filter(Boolean);
}

const removeExerciseFromSuperset = (exerciseList, ex) => {
    let exToAdd = [];
    let exToAddIndex = 0;
    let deleteSuperset;

    let exercises = exerciseList.map((e, i) => {
        if (e._id === ex.supersetId) {
            e.superset = e.superset.filter(ee => {
                if (ee._id === ex._id || e.superset.length <= 2) {
                    exToAdd.push(ee);
                    exToAddIndex = i + 1;
                    return false;
                } else {
                    return ee;
                }
            });
            if (e.superset.length === 0) {
                deleteSuperset = e._id;
            }
        }
        return e;
    });

    exercises.splice(exToAddIndex, 0, exToAdd[0]);

    if (exToAdd[1]) {
        exercises.splice(exToAddIndex + 1, 0, exToAdd[1]);
    }

    if (deleteSuperset) {
        exercises = exercises.filter(e => e._id !== deleteSuperset);
    }

    return exercises;
}

const supersetIndex = (exerciseList, id) => {
    let _index = 0;
    for (let i = 0; i < exerciseList.length; i++) {
        if (exerciseList[i].superset?.length > 0) {
            _index++;
            if (exerciseList[i]._id === id) break;
        }
    }
    return _index;
}

export { setSupersetWithTheNext, removeExerciseFromSuperset, supersetIndex };