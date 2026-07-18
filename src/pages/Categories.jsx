import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import api from "../api";

function Categories() {

    const [bookGenres, setBookGenres] = useState([]);
const [movieGenres, setMovieGenres] = useState([]);
const [gameGenres, setGameGenres] = useState([]);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentEndpoint, setCurrentEndpoint] = useState("");

    const [editingGenre, setEditingGenre] = useState(null);

    const [form] = Form.useForm();

    const loadCategories = async () => {

        try{

            const [books, movies, games] = await Promise.all([
    api.get("/BookGenre?limit=1000"),
    api.get("/MovieGenre?limit=1000"),
    api.get("/GameGenre?limit=1000"),
]);

setBookGenres(books.data.list);
setMovieGenres(movies.data.list);
setGameGenres(games.data.list);

        }

        catch(error){

            console.log(error);

        }

    };

    useEffect(() => {

        loadCategories();

    }, []);

    const handleEdit = async(values)=>{

        try{

            await api.patch(`/BookGenre/${editingGenre.ID}`,{

                Name: values.Name,

            });

            message.success("Genre updated!");

            setEditOpen(false);

            loadCategories();

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

                                        await api.delete(`/BookGenre/${genre.ID}`);

                                        message.success("Genre deleted!");

                                        loadCategories();

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

            <h1>Categories</h1>

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

            <h2>📚 Book Genres</h2>

<Table
    rowKey="ID"
    columns={columns}
    dataSource={bookGenres}
/>

<h2 style={{marginTop:40}}>🎬 Movie Genres</h2>

<Table
    rowKey="ID"
    columns={columns}
    dataSource={movieGenres}
/>

<h2 style={{marginTop:40}}>🎮 Game Genres</h2>

<Table
    rowKey="ID"
    columns={columns}
    dataSource={gameGenres}
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

                            await api.post("/BookGenre",{

                                Name:values.Name,

                            });

                            message.success("Genre created!");

                            setCreateOpen(false);

                            loadCategories();

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

export default Categories;