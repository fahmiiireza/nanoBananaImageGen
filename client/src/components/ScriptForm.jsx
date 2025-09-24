
import React, { useState } from 'react';

function ScriptForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    imageDescription: '',
    products:'',
    googleDriveFolderName: '',
    model: 'Nano Banana (Text to Image)',
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
    setImageFile(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.model !== 'Flux Pro (Text to Image)' && formData.model !== 'Nano Banana (Text to Image)') {
      for (let i = 0; i < imageFile.length; i++) {
        data.append('image', imageFile[i]);
      }
    }
    const vertical = formData.googleDriveFolderName.split('-')[1]?.trim();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append('vertical', vertical);
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
        <label htmlFor="model">Model</label>
        <select
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
        >
          <option value="Nano Banana (Text to Image)">Nano Banana (Text to Image)</option>
          <option value="Nano Banana (Image to Image)">Nano Banana (Image to Image)</option>
          <option value="Flux Pro (Text to Image)">Flux Pro (Text to Image)</option>
          <option value="Flux Pro Ultra (Image to Image)">Flux Pro Ultra (Image to Image)</option>
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
  <label htmlFor="imageCount">Number of Images</label>
  <input
    type="number"
    id="imageCount"
    name="imageCount"
    value={formData.imageCount}
    onChange={handleChange}
    min="1"
    step="1"
  />
</div>


      {formData.model !== 'Flux Pro (Text to Image)' && formData.model !== 'Nano Banana (Text to Image)' && (
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            multiple={formData.model.includes('Nano Banana')}
          />
        </div>
      )}

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
