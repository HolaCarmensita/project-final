import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: ${(p) => (p.open ? "block" : "none")};
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
  box-shadow: 0 -8px 24px rgba(0,0,0,0.15);
  padding: 24px 20px 16px;
  z-index: 31;
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

const Button = styled.button`
  flex: 1;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid #232323;
  font-size: 16px;
  cursor: pointer;
  background: ${(p) => (p.primary ? "#232323" : "#fff")};
  color: ${(p) => (p.primary ? "#fff" : "#232323")};
`;

const AddIdeaSheet = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handlePost = (e) => {
    e.preventDefault();
    onSubmit?.({ title, description: desc, files });
  };

  return (
    <>
      <Overlay open={isOpen} onClick={onClose} />
      {isOpen && (
        <Sheet role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handlePost}>
            <Title>Adding idea</Title>

            <Label htmlFor="idea-title">Idea Title</Label>
            <Input
              id="idea-title"
              placeholder="Enter the title of your idea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Label htmlFor="idea-desc">Description</Label>
            <TextArea
              id="idea-desc"
              placeholder="Describe your idea..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <Label htmlFor="idea-files">Upload file</Label>
            <Input id="idea-files" type="file" multiple onChange={handleFiles} />

            <Row>
              <Button type="button" onClick={onClose}>CANCEL</Button>
              <Button type="submit" primary>POST</Button>
            </Row>
          </form>
        </Sheet>
      )}
    </>
  );
};

export default AddIdeaSheet;
