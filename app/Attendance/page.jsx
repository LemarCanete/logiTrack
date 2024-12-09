'use client'
import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import { useRouter } from 'next/navigation';
import {Button} from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'

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
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'eventData',
      headerName: 'Date',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
        field: 'status',
        headerName: 'Status',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
      },
];

const paginationModel = { page: 0, pageSize: 10 };


const Attendance = () => {
    const router = useRouter();
    const [data, setData] = useState([
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
      ])

    return (
        <div className=''>
            <Navbar />
            <div className="mx-auto lg:w-5/6 flex flex-col lg:flex-row  gap-36 my-6 w-screen lg:-pe-10">
                <IoChevronBackCircleSharp className='text-5xl text-gray-200 cursor-pointer hover:text-gray-500 ms-36'
                    onClick={()=> router.back()}/>
                <h1 className="text-xl md:text-3xl font-semibold text-center tracking-wide leading-3 me-10">Attendance Log</h1>
                {/* Add members */}
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="" className='w-5/6 lg:w-64 mx-auto'>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[300px] text-sm md:w-[425px] lg:w-[1000px] lg:h-[400px]">
                        <DialogHeader>
                        <DialogTitle>Add Members</DialogTitle>
                        <DialogDescription>
                            Fill out Event Members RFID or name. Click save when you're done.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input placeholder='Search'/>
                        </div>
                        <DialogFooter>
                            <Button >Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog> */}
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

export default Attendance