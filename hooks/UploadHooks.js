import {useState} from 'react';
import validate from 'validate.js';
import validation from '../components/validation';

const useUploadForm = () => {

    const [inputs, setInputs] = useState({});

    
    const handleTitleChange = (text) => {
        const error = validate({title: inputs.title}, {title: validation.title});
        console.log(error);
      setInputs((inputs) =>
        ({
          ...inputs,
          title: text,
          titleError: error,
        }));
    };
    const handleDescChange = (text) => {
      setInputs((inputs) =>
        ({
          ...inputs,
          description: text,
        }));
    };


    return {
      handleTitleChange,
      handleDescChange,
      inputs,
    };
  };







  export default useUploadForm;