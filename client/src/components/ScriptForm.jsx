
import React, { useState } from 'react';

function ScriptForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    script: '',
    ageRange: '25-34',
    gender: 'female',
    product: '',
    room: 'living room',
    style: 'casual and friendly',
    imageCount: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="script">Script *</label>
        <textarea
          id="script"
          name="script"
          value={formData.script}
          onChange={handleChange}
          placeholder="Enter a description of the image you want to generate..."
          required
          minLength={10}
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
        <label htmlFor="ageRange">Age Range</label>
        <select
          id="ageRange"
          name="ageRange"
          value={formData.ageRange}
          onChange={handleChange}
        >
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55+">55+</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non-binary">Non-binary</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="room">Room/Setting</label>
        <select
          id="room"
          name="room"
          value={formData.room}
          onChange={handleChange}
        >
          <option value="living room">Living Room</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="bedroom">Bedroom</option>
          <option value="home office">Home Office</option>
          <option value="porch">Porch</option>
          <option value="backyard">Backyard/Patio</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="style">Style</label>
        <select
          id="style"
          name="style"
          value={formData.style}
          onChange={handleChange}
        >
          <option value="casual and friendly">Casual & Friendly</option>
          <option value="professional">Professional</option>
          <option value="energetic">Energetic</option>
          <option value="calm and soothing">Calm & Soothing</option>
          <option value="luxury">Luxury</option>
        </select>
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
