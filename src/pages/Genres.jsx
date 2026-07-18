import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import api from "../api";

function Genres() {

    const [genres, setGenres] = useState([]);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [editingGenre, setEditingGenre] = useState(null);

    const [form] = Form.useForm();

    const loadGenres = async () => {

        try{

            const response = await api.get("/Genre?limit=1000");

            setGenres(response.data.list);

        }

        catch(error){

            console.log(error);

        }

    };

    useEffect(() => {

        loadGenres();

    }, []);

    const handleEdit = async(values)=>{

        try{

            await api.patch(`/Genre/${editingGenre.ID}`,{

                Name: values.Name,

            });

            message.success("Genre updated!");

            setEditOpen(false);

            loadGenres();

        }

        catch(error){

            console.log(error);

            message.error("Unable to update genre.");

        }

    };

    const columns = [

        {
            title:"ID",
            dataIndex:"ID",
        },

        {
            title:"Genre",
            dataIndex:"Name",
        },

        {

            title:"Actions",

            render:(_,genre)=>(

                <>

                    <Button
                        onClick={()=>{

                            setEditingGenre(genre);

                            form.setFieldsValue({

                                Name:genre.Name,

                            });

                            setEditOpen(true);

                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        danger
                        style={{marginLeft:10}}
                        onClick={()=>{

                            Modal.confirm({

                                title:"Delete Genre",

                                content:`Delete ${genre.Name}?`,

                                onOk:async()=>{

                                    try{

                                        await api.delete(`/Genre/${genre.ID}`);

                                        message.success("Genre deleted!");

                                        loadGenres();

                                    }

                                    catch(error){

                                        message.error("Unable to delete genre.");

                                    }

                                }

                            });

                        }}
                    >
                        Delete
                    </Button>

                </>

            )

        }

    ];

    return(

        <>

            <h1>Genres</h1>

            <Button
                type="primary"
                style={{marginBottom:20}}
                onClick={()=>{
                    form.resetFields();
                    setCreateOpen(true);
                }}
            >
                + Create Genre
            </Button>

            <Table

                rowKey="ID"

                columns={columns}

                dataSource={genres}

            />

            <Modal

                open={createOpen}

                title="Create Genre"

                onCancel={()=>setCreateOpen(false)}

                onOk={()=>form.submit()}

            >

                <Form

                    form={form}

                    layout="vertical"

                    onFinish={async(values)=>{

                        try{

                            await api.post("/Genre",{

                                Name:values.Name,

                            });

                            message.success("Genre created!");

                            setCreateOpen(false);

                            loadGenres();

                        }

                        catch(error){

                            message.error("Unable to create genre.");

                        }

                    }}

                >

                    <Form.Item

                        label="Genre Name"

                        name="Name"

                        rules={[{required:true}]}

                    >

                        <Input/>

                    </Form.Item>

                </Form>

            </Modal>

            <Modal

                open={editOpen}

                title="Edit Genre"

                onCancel={()=>setEditOpen(false)}

                onOk={()=>form.submit()}

            >

                <Form

                    form={form}

                    layout="vertical"

                    onFinish={handleEdit}

                >

                    <Form.Item

                        label="Genre Name"

                        name="Name"

                        rules={[{required:true}]}

                    >

                        <Input/>

                    </Form.Item>

                </Form>

            </Modal>

        </>

    );

}

export default Genres;