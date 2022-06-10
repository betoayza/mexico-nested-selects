import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController=new AbortController();
    const signal=abortController.signal; //signal shows if abort happened or not
  
    const fetchData=async()=>{
      setLoading(true);
      try {
        const res=await fetch(url);
        if(!res.ok){
          let err=new Error("Request error");
          err.status=res.status || '00';
          err.statusText=res.statusText || 'An error occurred';
          throw err;
        }else{
          const json=await res.json();
          
          if(!signal.aborted){
            setData(json);
            setError(null);
          }
        }
      } catch (error) {
        if(!signal.aborted){
          setData(null);
          setError(error);
        }
      } finally {
        if(!signal.aborted){
            setLoading(false);
        }
      }
    };
    fetchData();

    return ()=>abortController.abort();
  }, [url]);

  return { data, error, loading };
};
