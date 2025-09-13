
import React, { useState } from 'react';

function ScriptForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    imageDescription: '',
    aspectRatio: '1080x1920',
    seed: '',
    negativePrompt: '',
    product: '',
    googleDriveFolderName: '',
    vertical: 'EDU',
    imageCount: 1,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', imageFile);
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    onSubmit(data);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="googleDriveFolderName">Google Drive Folder Name</label>
        <input
          type="text"
          id="googleDriveFolderName"
          name="googleDriveFolderName"
          value={formData.googleDriveFolderName}
          onChange={handleChange}
          placeholder="(Project Description/iteration) (- Headline #) ( - Body #) ( - CTA #)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="vertical">Vertical</label>
        <select
          id="vertical"
          name="vertical"
          value={formData.vertical}
          onChange={handleChange}
        >
          <option value="EDU">EDU</option>
          <option value="Cash Offer Aggro">Cash Offer Aggro</option>
          <option value="Clinical Trial">Clinical Trial</option>
          <option value="Windows">Windows</option>
          <option value="Cash Offer Vanilla">Cash Offer Vanilla</option>
          <option value="Gutters">Gutters</option>
          <option value="GLP-1">GLP-1</option>
          <option value="TRT">TRT</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="imageDescription">Image description *</label>
        <textarea
          id="imageDescription"
          name="imageDescription"
          value={formData.imageDescription}
          onChange={handleChange}
          placeholder='Enter a detailed image description of what kind of image they want to make, start with "Generate an image of..."'
          required
          minLength={10}
        />
      </div>

      <div className="form-group">
        <label htmlFor="negativePrompt">Negative Prompt</label>
        <textarea
          id="negativePrompt"
          name="negativePrompt"
          value={formData.negativePrompt}
          onChange={handleChange}
          placeholder="e.g., blurry, low quality, bad hands..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="aspectRatio">Aspect Ratio</label>
        <select
          id="aspectRatio"
          name="aspectRatio"
          value={formData.aspectRatio}
          onChange={handleChange}
        >
          <option value="1080x1920">1080x1920</option>
          <option value="1920x1080">1920x1080</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="seed">Seed</label>
        <input
          type="text"
          id="seed"
          name="seed"
          value={formData.seed}
          onChange={handleChange}
          placeholder="e.g., 12345..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="product">Product Name</label>
        <input
          type="text"
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          placeholder="e.g., Skincare Serum, Coffee Maker..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageCount">Number of Images</label>
        <select
          id="imageCount"
          name="imageCount"
          value={formData.imageCount}
          onChange={handleChange}
        >
          <option value="1">1</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
        />
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? `Generating ${formData.imageCount} Images...` : 'Generate Images'}
      </button>
    </form>
  );
}

export default ScriptForm;
