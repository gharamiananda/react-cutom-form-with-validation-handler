 
/* eslint-disable @typescript-eslint/no-unused-vars */
 
import getReactCustomFormValidationHandler from 'react-custom-form-with-validation-handler';
// import useForm from '../hooks/useForm';
import { schema } from './form.constant';


const {constants,getReactCustomFormValidationHandler:useForm,utils}=getReactCustomFormValidationHandler;
console.log('getReactCustomFormValidationHandler', getReactCustomFormValidationHandler)
// console.log('constants,utils', constants,utils)
function FormOne() {
  

  console.log('constants,utils', constants,utils)

  const initialFormValues = {
    userName: "sssss",
    email: "testmail",
    mobile:'9',
    age:10,
    aggrredTerms:false,
    dob:null
  };

  const onSubmit = (formValues:Record<string,unknown>) => {
    console.log("Form submitted with:", formValues);
  };

  const {  render, setRender,formRef,   errorRef, valuesRef,
   touchedRef, handleChange, handleBlur, handleSubmit ,onFocus} = useForm(
     {
      initialValues:   initialFormValues,
      onSubmitCallback:  onSubmit,
      options:{ validationSchema:schema}
    }
  );
  const formErrors=errorRef.current;

  const errorMessageClass='mt-2 text-sm text-red-600 dark:text-red-500';
  const errorLabelClass='block mb-2 text-sm font-medium text-red-700 dark:text-red-500';
  const errorInputClass='bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';




  const successLabelClass='block mb-2 text-sm font-medium text-green-700 dark:text-green-500';
  const successInputClass='bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500';



  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl h-screen">


<form noValidate className="max-w-sm mx-auto" onSubmit={handleSubmit}>
 
  <div>
    <label  className={formErrors?.userName?.[0]?.message ? errorLabelClass : successLabelClass}>Your Username</label>
    <input 
    onFocus={onFocus}
name='userName'
onChange={e=>handleChange(e,{MULTISPACEALLOW:true,UPPERCASE:true,MAXLENGTH:9})}
onBlur={handleBlur}

    // ref={(element) => formRef.current['email'] = element} 
    ref={(element) => formRef.current['userName'] = element} 

    type="text" id="username-error" className={formErrors?.userName?.[0]?.message ? errorInputClass : successInputClass}  placeholder="Bonnie Green" />
   {formErrors?.userName?.[0]?.message && <p className={errorMessageClass}  > {formErrors?.userName?.[0]?.message}</p>}
  </div>

 
  <div>
    <label  className={formErrors?.age?.[0]?.message ? errorLabelClass : successLabelClass}>Your Age</label>
    <input 
    onFocus={onFocus}
name='age'
onChange={e=>handleChange(e,{MULTISPACEALLOW:true,UPPERCASE:true,MAXLENGTH:9})}
onBlur={handleBlur}

    // ref={(element) => formRef.current['email'] = element} 
    ref={(element) => formRef.current['age'] = element} 

    type="text" id="username-error" className={formErrors?.age?.[0]?.message ? errorInputClass : successInputClass}  placeholder="Bonnie Green" />
   {formErrors?.age?.[0]?.message && <p className={errorMessageClass}  > {formErrors?.age?.[0]?.message}</p>}
  </div>

  <div>
    <label  className={formErrors?.email?.[0]?.message ? errorLabelClass : successLabelClass}>Your email</label>
    <input 
    onFocus={onFocus}
name='email'
onChange={e=>handleChange(e,{LOWERCASE:true,MAXLENGTH:50})}
onBlur={handleBlur}
    // ref={(element) => formRef.current['email'] = element} 
    ref={(element) => formRef.current['email'] = element} 

    type="text" id="username-error" className={formErrors?.email?.[0]?.message ? errorInputClass : successInputClass}  placeholder="Bonnie Green" />
   {formErrors?.email?.[0]?.message && <p className={errorMessageClass}  > {formErrors?.email?.[0]?.message}</p>}
  </div>




  <div>
    <label  className={formErrors?.mobile?.[0]?.message ? errorLabelClass : successLabelClass}>Your Mobile</label>
    <input 
    onFocus={onFocus}
name='mobile'

onChange={e=>handleChange(e,{LOWERCASE:true,MAXLENGTH:10,NOSPACIALCHARATERALLOW:true,ONLYNUMBERALLOW:true})}
onBlur={handleBlur}
    // ref={(element) => formRef.current['email'] = element} 
    ref={(element) => formRef.current['mobile'] = element} 

    type="text" id="username-error" className={formErrors?.mobile?.[0]?.message ? errorInputClass : successInputClass}  placeholder="Bonnie Green" />
   {formErrors?.mobile?.[0]?.message && <p className={errorMessageClass}  > {formErrors?.mobile?.[0]?.message}</p>}
  </div>


<div className="relative max-w-sm my-5">
<label  className={formErrors?.dob?.[0]?.message ? errorLabelClass : successLabelClass}>Your Date of birth</label>

  <input 
    onFocus={onFocus}
    name='dob'
    
    onChange={e=>handleChange(e,{LOWERCASE:true,MAXLENGTH:10,NOSPACIALCHARATERALLOW:true,ONLYNUMBERALLOW:true})}
    onBlur={handleBlur}
        // ref={(element) => formRef.current['email'] = element} 
        ref={(element) => formRef.current['dob'] = element} 
  
  id="default-datepicker" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
   {formErrors?.dob?.[0]?.message && <p className={errorMessageClass}  > {formErrors?.dob?.[0]?.message}</p>}
</div>
 
  <div className="flex items-start mb-5">
    <div className="flex items-center h-5">
      <input
    ref={(element) => formRef.current['aggrredTerms'] = element} 
    onChange={handleChange}

    // ref={(element) => formRef.current[0] = element} 
      name='aggrredTerms'
      id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
    </div>
    <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
  </div>





  
  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
  <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>{
    if (formRef.current['email']) {
     
      formRef.current['email'].value='ttttttt'
    }
    setRender(Math.random())}}>setRender</button>
  
</form>

    </div>
  )
}

export default FormOne
