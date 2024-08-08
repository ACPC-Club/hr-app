document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('add-event-image');
    const selectImageButton = document.getElementById('select-image-button');
    const imagePreview = document.getElementById('image-preview');
  
    selectImageButton.addEventListener('click', () => {
      fileInput.click();
    });
  
    fileInput.addEventListener('change', handleFiles, false);
  
    // Prevent default behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
  
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
  
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
  
    function highlight() {
      dropArea.classList.add('highlight');
    }
  
    function unhighlight() {
      dropArea.classList.remove('highlight');
    }
  
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
  
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
  
      fileInput.files = files; // Assign the files to the file input element
      handleFiles();
    }
  
    function handleFiles() {
      const files = fileInput.files;
      imagePreview.innerHTML = ''; // Clear the current preview
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '150px';
          imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    }
  });
  document.getElementById('event-image').addEventListener('change', function () {
    const placeholder = document.querySelector('.file-input-placeholder');
    if (this.files.length > 0) {
      placeholder.style.display = 'none';
    } else {
      placeholder.style.display = 'block';
    }
  });
  