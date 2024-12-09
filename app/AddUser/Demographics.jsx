import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Formik} from 'formik'
import { Box } from '@mui/material'

const Demographics = ({handleBack, handleNext, activeStep, steps}) => {

    return (
            <Formik
                initialValues={{ email: '', password: '', firstname: '', lastname: '', password: '', confirmPassword: '', id: '' }}
                validate={values => {
                    const errors = {};
                    if(!values.firstname){
                        errors.firstname = 'Required';
                    }else if(!values.lastname){
                        errors.lastname = 'Required';
                    } else if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    } else if(!values.password){
                        errors.password = 'Required';
                    } else if(values.confirmPassword !== values.password){
                        errors.confirmPassword = 'Incorrect Password!';
                    } 
                        return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                    //alert(JSON.stringify(values, null, 2));
                    const docData = {
                        firstname: values.firstname,
                        lastname: values.lastname,
                        email: values.email,
                        password: values.password
                    };
                    sessionStorage.setItem('values', JSON.stringify(docData));
                    console.log(docData);
                    // const docRef = addDoc(collection(db, "users"), docData);
                    // setDoc(doc(db, "users", docRef.id), {docid: docRef.id}, {merge:true})
                    setSubmitting(false);
                    }, 400);
                    handleNext();
                }}

                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className='flex flex-col justify-around'>
                        <h1 className="text-center text-2xl mb-2">Add User</h1>
                        {/* first name */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            <Label className=''>
                                First Name
                                <span className='text-red-500 text-right ms-5'>* {errors.firstname && touched.firstname && errors.firstname}</span>
                                <Input className='bg-white my-2' type="text"
                                    name="firstname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstname}/>
                            </Label>
                            <Label className=''>
                                Last Name
                                <span className='text-red-500 text-right ms-5'>* {errors.lastname && touched.lastname && errors.lastname}</span>
                                <Input className='bg-white my-2' type="text"
                                    name="lastname"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastname}/>
                            </Label>
                        </div>
                        {/* email */}
                        <Label className=''>
                            Email
                            <span className='text-red-500 text-right ms-5'>* {errors.email && touched.email && errors.email}</span>
                            <Input className='bg-white my-2' type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}/>
                        </Label>
                        
                        
                        {/* password */}
                        <Label className=''>
                            Password
                            <span className='text-red-500 text-right ms-5'>* {errors.password && touched.password && errors.password}</span>
                            <Input className='bg-white my-2' type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}/>
                        </Label>

                        <Label className=''>
                            Confirm Password
                            <span className='text-red-500 text-right ms-5'>* {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</span>
                            <Input className='bg-white my-2' type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword}/>
                        </Label>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                    >Back</Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button type='submit' disabled={isSubmitting}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                    </form>
                )}
            </Formik>
    )
}

export default Demographics