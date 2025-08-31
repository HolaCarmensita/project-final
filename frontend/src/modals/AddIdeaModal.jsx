import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { useIdeasStore } from '../store/useIdeasStore';
import { useUIStore } from '../store/useUIStore';
import { uploadMultipleImages } from '../services/firebaseStorage';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: ${(p) => (p.open ? 'block' : 'none')};
  z-index: 30;
`;

const Sheet = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(680px, 100%);
  background: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.15);
  padding: 24px 20px 16px;
  z-index: 5001;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-weight: 600;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin: 14px 0 6px;
`;

const FileList = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  max-height: 100px;
  overflow-y: auto;
`;

const FileItem = styled.div`
  font-size: 12px;
  color: #666;
  margin: 2px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveFileButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    background: #cc0000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  resize: vertical;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 18px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 16px;
  padding: 12px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
`;

const AddIdeaSheet = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Get store functions
  const createIdea = useIdeasStore((state) => state.createIdea);
  const isLoading = useIdeasStore((state) => state.isLoading);
  const error = useIdeasStore((state) => state.error);
  const clearError = useIdeasStore((state) => state.clearError);
  const setIsAddOpen = useUIStore((state) => state.setIsAddOpen);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || []);
    console.log('Files selected:', newFiles.length);
    newFiles.forEach((file, index) => {
      console.log(
        `Selected file ${index}:`,
        file.name,
        'Size:',
        file.size,
        'Type:',
        file.type
      );
    });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    setTitleError('');
    setDescError('');
    clearError();

    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      isValid = false;
    } else if (title.trim().length > 100) {
      setTitleError('Title must be less than 100 characters');
      isValid = false;
    }

    // Validate description
    if (!desc.trim()) {
      setDescError('Description is required');
      isValid = false;
    } else if (desc.trim().length < 10) {
      setDescError('Description must be at least 10 characters');
      isValid = false;
    } else if (desc.trim().length > 2000) {
      setDescError('Description must be less than 2000 characters');
      isValid = false;
    }

    return isValid;
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Submitting idea with files:', files.length);

      // Step 1: Upload images to Firebase Storage if there are any files
      let imageUrls = [];
      if (files.length > 0) {
        console.log('Uploading images to Firebase Storage...');
        imageUrls = await uploadMultipleImages(files, 'ideas');
        console.log('Images uploaded successfully:', imageUrls);
      }

      // Step 2: Send idea data with image URLs to backend
      const result = await createIdea({
        title: title.trim(),
        description: desc.trim(),
        imageUrls, // Send URLs instead of files
      });

      if (result.success) {
        setIsSuccess(true);
        // Reset form
        setTitle('');
        setDesc('');
        setFiles([]);

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsAddOpen(false);
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to create idea:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setDesc('');
      setFiles([]);
      setTitleError('');
      setDescError('');
      clearError();
      setIsSuccess(false);
      setIsAddOpen(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleError('');
    clearError();
    setIsSuccess(false);
  };

  const handleDescChange = (e) => {
    setDesc(e.target.value);
    setDescError('');
    clearError();
    setIsSuccess(false);
  };

  return (
    <>
      <Overlay open={isOpen} onClick={handleClose} />
      {isOpen && (
        <Sheet
          role='dialog'
          aria-modal='true'
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handlePost}>
            <Title>Adding idea</Title>

            <Label htmlFor='idea-title'>Idea Title</Label>
            <Input
              id='idea-title'
              placeholder='Enter the title of your idea'
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading || isSuccess}
            />
            {titleError && <ErrorMessage>{titleError}</ErrorMessage>}

            <Label htmlFor='idea-desc'>Description</Label>
            <TextArea
              id='idea-desc'
              placeholder='Describe your idea...'
              value={desc}
              onChange={handleDescChange}
              disabled={isLoading || isSuccess}
            />
            {descError && <ErrorMessage>{descError}</ErrorMessage>}

            <Label htmlFor='idea-files'>Upload file</Label>
            <Input
              id='idea-files'
              type='file'
              multiple
              accept='image/png, image/jpeg'
              onChange={handleFiles}
              disabled={isLoading || isSuccess}
            />

            {files.length > 0 && (
              <FileList>
                {files.map((file, index) => (
                  <FileItem key={index}>
                    <span>{file.name}</span>
                    <RemoveFileButton
                      type='button'
                      onClick={() => removeFile(index)}
                      disabled={isLoading || isSuccess}
                    >
                      Remove
                    </RemoveFileButton>
                  </FileItem>
                ))}
              </FileList>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isSuccess && (
              <SuccessMessage>
                Idea created successfully! Closing modal...
              </SuccessMessage>
            )}

            <Row>
              <Button
                type='button'
                onClick={handleClose}
                disabled={isLoading || isSuccess}
              >
                CANCEL
              </Button>
              <Button type='submit' primary disabled={isLoading || isSuccess}>
                {isLoading ? 'POSTING...' : isSuccess ? 'SUCCESS!' : 'POST'}
              </Button>
            </Row>
          </form>
        </Sheet>
      )}
    </>
  );
};

export default AddIdeaSheet;
