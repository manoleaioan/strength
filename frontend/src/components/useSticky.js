import  { useEffect } from 'react';

export default function useSticky(ref,handler) {

  useEffect(
    () => {
      const header = ref.current;
      const sticky = header.offsetTop;
      const parent = ref.current.parentNode.parentElement;

      const scrollCallBack = parent.addEventListener("scroll", () => {
        //  console.log( parent.scrollTop, header.offsetHeight)
        // console.log(ref)
        if ( parent.scrollTop>10) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      });
      return () => {
        parent.removeEventListener("scroll", scrollCallBack);
      };
    },
    [ref, handler]
  );
}