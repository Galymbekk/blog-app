import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editablePost, setEditablePost] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        setIsLoading(true)
        axios.get('http://localhost:8000/api/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setProfile(res.data)
            setIsLoading(false)
        })
        .catch(err => {
            console.error("Профиль қатесі: ", err.message)
            setIsLoading(false)
        })
    }, [token])

    const handleUpdate = (updatedPost) => {
        axios.put(
            `http://localhost:8000/api/updatePost/${updatedPost.id}`,
            updatedPost,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(res => {
            setProfile(prev => ({
                ...prev,
                myPosts: prev.myPosts.map(p => p.id === updatedPost.id ? res.data : p)
            }))
            setShowModal(false)
            setEditablePost(null)
        })
        .catch(err => {
            console.error("Өзгерту қатесі:", err.message)
        })
    }

    const handleDelete = (id) => {
        if (window.confirm("Постты өшіргіңіз келе ме?")) {
            axios.delete(
                `http://localhost:8000/api/deletePost/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then(() => {
                setProfile(prev => ({
                    ...prev,
                    myPosts: prev.myPosts.filter(p => p.id !== id)
                }))
            })
            .catch(err => {
                console.error("Өшіру кезінде қате:", err.message)
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-white rounded-lg shadow p-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Профильді жүктеу қатесі</h3>
                    <p className="mt-1 text-sm text-gray-500">Профиль ақпаратын алу мүмкін емес</p>
                    <div className="mt-6">
                        <Link
                            to="/home"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Басты бетке оралу
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Модальное окно */}
            {showModal && editablePost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50"
                    onClick={() => setShowModal(false)}
                ></div>
                
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50">
                    <h2 className="text-xl font-bold mb-4">Edit Post</h2>
                    <input 
                    type="text" 
                    className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={editablePost.title}
                    onChange={(e) => setEditablePost({ ...editablePost, title: e.target.value })}
                    />
                    <textarea 
                    className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows="4"
                    value={editablePost.content}
                    onChange={(e) => setEditablePost({ ...editablePost, content: e.target.value })}
                    />

                    <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => handleUpdate(editablePost)} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    </div>
                </div>
                </div>
            )}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <div className="mb-6">
                    <Link 
                        to="/home" 
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Басты бетке оралу
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <svg className="mr-2 h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Менің профилім
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500">Аты</label>
                            <p className="mt-1 text-lg font-medium text-gray-900">{profile.userData.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="mt-1 text-lg font-medium text-gray-900">{profile.userData.email}</p>
                        </div>
                    </div>
                </div>

                {/* My Posts Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <svg className="mr-2 h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Менің посттарым
                        </h2>
                    </div>
                    
                    {profile.myPosts.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Посттар жоқ</h3>
                            <p className="mt-1 text-sm text-gray-500">Жаңа пост қосыңыз</p>
                            <div className="mt-6">
                                <Link
                                    to="/add-post"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Жаңа пост
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
                            {profile.myPosts.map(post => (
                                <div key={post.id} className="flex flex-col rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                    {post.image && (
                                        <div className="h-48 w-full overflow-hidden">
                                            <img
                                                src={`http://localhost:8000/uploads/${post.image}`}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                                            <p className="text-gray-500 line-clamp-3">{post.content}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditablePost(post)
                                                        setShowModal(true)
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Өзгерту"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Өшіру"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}