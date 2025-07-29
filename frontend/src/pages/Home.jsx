import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState("all") 
  const [showModal, setShowModal] = useState(false)
  const [editablePost, setEditablePost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    axios.get('http://localhost:8000/api/posts')
      .then(response => {
        setPosts(response.data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching posts: ', err.message)
        setIsLoading(false)
      })
  }, [])

  const handleUpdate = (updatedPost) => {
    const token = localStorage.getItem('token')
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
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? res.data : p))
      setShowModal(false)
      setEditablePost(null)
    })
    .catch(err => {
      console.error("Update error:", err.message)
    })
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const token = localStorage.getItem('token')
      axios.delete(
        `http://localhost:8000/api/deletePost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => {
        setPosts(prev => prev.filter(p => p.id !== id))
      })
      .catch(err => {
        console.error("Delete error:", err.message)
      })
    }
  }

  const signedUser = JSON.parse(localStorage.getItem('user'))
  const filteredPosts = filter === "all" ? posts : posts.filter(post => post.user_id === signedUser?.userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      
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


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Add Post */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === "all" ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter("my")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === "my" ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
              >
                My Posts
              </button>
            </div>
            <Link
              to="/add-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Create Post
              <svg className="ml-1 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
            <div className="mt-6">
              <Link
                to="/add-post"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <article key={post.id} className="flex flex-col rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
                {post.image && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={`http://localhost:8000/uploads/${post.image}`}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-500 mb-4 line-clamp-3">{post.content}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    {filter === "my" && post.user_id === signedUser?.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditablePost(post)
                            setShowModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}