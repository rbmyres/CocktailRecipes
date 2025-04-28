import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useLoading } from "../LoadingContext"; 
import Modal from '../Components/Modal';
import ImageUpload from '../Components/ImageUpload';
import PostPreview from '../Components/PostPreview';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';


function CreatePost(){

    const { authorized } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [primarySpirit, setPrimarySpirit] = useState('');
    const { setLoading } = useLoading(); 
    const [postType, setPostType] = useState('');
    const [ingredients, setIngredients] = useState([{desc: '', amt: ''}]);
    const [directions, setDirections] = useState(['']);
    const [error, setError] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    const addIng = () => setIngredients([...ingredients, {desc: '', amt: ''}]);
    const remIng = () =>{
        if (ingredients.length > 1){
            setIngredients(ingredients.slice(0, -1));
        }
    }

    const updateIng = (i, field, val) => {
        const temp = [...ingredients];
        temp[i][field] = val;
        setIngredients(temp);
    }

    const addDir = () => setDirections([...directions, '']);
    const remDir = () => {
        if (directions.length > 1) {
            setDirections(directions.slice(0, -1));
        }
    }

    const updateDir = (i, val) => {
        const temp = [...directions];
        temp[i] = val;
        setDirections(temp);
    }

    const formComplete = 
        title.trim() !== '' &&
        primarySpirit !== '' &&
        postType !== '' &&
        imageURL !== '' &&
        ingredients.some(i => i.desc.trim() !== '' && i.amt.trim() !== '') &&
        directions.some(d => d.trim() !== '');

    const handlePreview = () => {
        if (!formComplete) {
            toast.error("Please fill in all fields");
            return;
        }
        setError('');
        setPreviewModalOpen(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = {
            title: title,
            primarySpirit,
            postType,
            ingredients,
            directions,
            imageURL
        }
        try {
            await axios.post(`${API_URL}/post/create`, data, { withCredentials: true});
            navigate('/');
            toast.success("Post created successfully!");
        } catch (err){
            console.error(err);
            toast.error("Failed to create post");
            setLoading(false);
        }
    }

    return(

        <div className="createPost">
            <h1>Create Post</h1>
            <form>
                <div className='topContainer'>
                <input className='titleInput' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />

                <select className='spiritSelect' value={primarySpirit} onChange={(e) => setPrimarySpirit(e.target.value)}>
                    <option value="">- Please Select -</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Tequila">Tequila</option>
                    <option value="Whiskey">Whiskey</option>
                    <option value="Gin">Gin</option>
                    <option value="Rum">Rum</option>
                    <option value="Other">Other</option>
                </select>
                </div>

                <h3>Ingredients</h3>
                {ingredients.map((ing, i) => (
                    <div className='ingredientRow' key={i}>
                        <input className='ingredientInput' type='text' placeholder='Ingredient' value={ing.desc} onChange={(e) => updateIng(i, 'desc', e.target.value)} />
                        <input className='amountInput' type='text' placeholder='Amount' value={ing.amt} onChange={(e) => updateIng(i, 'amt', e.target.value)} />
                    </div>
                ))}
                <div className="buttonContainer">
                    <button className='addButton' type="button" onClick={addIng}><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#131112"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>
                    <button className='remButton' type="button" onClick={remIng}><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#131112"><path d="M200-440v-80h560v80H200Z"/></svg></button>
                </div>


                <h3>Directions</h3>
                {directions.map((dir, i) => (
                    <div className='directionRow' key={i}>
                        <span>{i + 1}.</span>
                        <input className='directionInput' type='text' placeholder='Direction' value={dir} onChange={(e) => updateDir(i, e.target.value)}/>
                    </div>
                ))}
                <div className="buttonContainer">
                    <button className='addButton' type="button" onClick={addDir}><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#131112"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>
                    <button className='remButton' type="button" onClick={remDir}><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#131112"><path d="M200-440v-80h560v80H200Z"/></svg></button>
                </div>

                <div className="bottomContainer">
                    <button type="button" className="uploadButton" onClick={() => setImageModalOpen(true)}>Upload Image</button>
                    <select value={postType} onChange={(e) => setPostType(e.target.value)}>
                        <option value="">- Please Select -</option>
                        <option value="Public">Public</option>
                        <option value="Drafts">Private</option>
                    </select>
                </div>

                <button type='button' className="previewButton" onClick={handlePreview} >View Preview</button>
                {error && <div className="errorMessage">{error}</div>}
            </form>

            <Modal open={imageModalOpen} onClose={() => setImageModalOpen(false)}>
                <ImageUpload 
                    onUpload={(imageURL) => {
                        setImageURL(imageURL);
                        setImageModalOpen(false);
                    }}
                />
            </Modal>

            <Modal open={previewModalOpen} onClose={() => setPreviewModalOpen(false)}>
            <PostPreview
                recipe_title={title}
                user_name={authorized.user_name}
                user_icon={authorized.user_icon}
                recipe_image={imageURL}
                primary_spirit={primarySpirit}
                like_count={0}
            />
            <button type="button" className="submitPostButton"onClick={handleSubmit}>Post</button>
            </Modal>
        </div>
    )
}

export default CreatePost;