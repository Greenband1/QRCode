'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    (function(squid){
      (window.$quid) || (window.$quid = {});
      document.head.appendChild((function(s){ 
        s.src='https://app.asksquid.ai/tfs/'+squid+'/sdk';
        s.async=1; 
        return s; 
      })(document.createElement('script')));
    })('6719103019d43af7a47a0bbb');
  }, []);

  return null;
}