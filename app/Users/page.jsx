'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import { useRouter } from 'next/navigation';
import {Button} from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '@/firebase-config';
//mui
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

//icon
import { IoChevronBackCircleSharp } from "react-icons/io5";

const columns = [
    { field: 'id', headerName: 'RFID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'email',
      headerName: 'Email',
      width: 90,
      sortable: true,
    },
    {
      field: 'date',
      headerName: 'Date',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
    },
    {
        field: 'password',
        headerName: 'Password',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
      },
];

const paginationModel = { page: 0, pageSize: 10 };


const Users = () => {
    const router = useRouter();
    const [data, setData] = useState([
        { id: 1, lastName: 'Snow', firstName: 'Jon', email: 2 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', email: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', email: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', email: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', email: null },
        { id: 6, lastName: 'Melisandre', firstName: null, email: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', email: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', email: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', email: 65 },
      ])

    useEffect(()=>{
        const getUsers = () =>{
            try{
                let date = new Date()
                const q = query(collection(db, "users"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const users = [];
                    querySnapshot.forEach((doc) => {
                        console.log(doc.data().demographics)
                        console.log(typeof(doc.data().demographics))

                        users.push({
                            id: doc.data().rfid,
                            firstName: doc.data().demographics.firstname,
                            lastName: doc.data().demographics.lastname,
                            email: doc.data().demographics.email,
                            date: date.getDate(),
                            password: doc.data().demographics.password,
                        });
                    });
                    setData(val => ([...users ]))
                });
            }catch(err){
                alert(err.message);
            }
        }

        getUsers();

    }, [])

    return (
        <div className=''>
            <Navbar />
            <div className="mx-auto lg:w-5/6 flex flex-col lg:flex-row lg:items-center gap-4 my-6 lg:justify-between w-screen">
                <div className="flex items-center gap-4 justify-center mx-auto">
                    <IoChevronBackCircleSharp className='text-5xl text-gray-200 cursor-pointer hover:text-gray-500'
                        onClick={()=> router.back()}/>
                    <h1 className="text-xl md:text-3xl font-semibold text-center tracking-wide leading-3">Users List</h1>
                </div>
                <Button variant="" className='w-5/6 lg:w-64 mx-auto' onClick={()=> router.push('./AddUser')}>Enroll a member</Button>
            </div>
            {/* table */}
            <div className="my-6">
                <Paper className='w-5/6 md:w-4/6 mx-auto'>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </div>
        </div>
    )
}

export default Users