import React, {useState} from 'react';
import {useRouter} from 'expo-router';

export default function UploadPost() {
    const router = useRouter();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
}