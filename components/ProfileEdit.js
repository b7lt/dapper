import React, { useState } from "react";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import { useCreateProfile, useUpdateProfile, useUserProfile } from "../utils/contract";
import { GiTopHat } from "react-icons/gi";
import { IoIosClose } from "react-icons/io";

export default function ProfileEdit({ onClose, isInitialSetup = false }) {
  const account = useActiveAccount();
  const { profile } = useUserProfile(account?.address);
  const { createProfile } = useCreateProfile();
  const { updateProfile } = useUpdateProfile();
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const isProfileExists = profile && profile.username && profile.username !== "";
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!account || isSubmitting) return;
    
    setError("");
    
    if (!isProfileExists && !username) {
      setError("Username is required");
      return;
    }
    
    if (!displayName) {
      setError("Display name is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isProfileExists) {
        await updateProfile({ 
          displayName: displayName, 
          avatarUri: "",
          bannerUri: ""
        });

      } else {
        await createProfile({ 
          username: username, 
          displayName: displayName, 
          avatarUri: "",
          bannerUri: ""
        });
      }
      
      console.log("Profile saved successfully");
      
      onClose();
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Error saving profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const editorTitle = isInitialSetup ? "Create Your Profile" : (isProfileExists ? "Edit Profile" : "Create Profile");
  const buttonText = isSubmitting ? "Saving..." : (isProfileExists ? "Save Changes" : "Create Profile");
  
  return (
    <ProfileEditor initialSetup={isInitialSetup}>
      {!isInitialSetup && (
        <EditorHeader>
          <CloseButton onClick={onClose}><IoIosClose/></CloseButton>
          <EditorTitle>{editorTitle}</EditorTitle>
        </EditorHeader>
      )}
      
      <EditorContent>
        <BannerUpload>
          <BannerPlaceholder />
        </BannerUpload>
        
        <AvatarUpload>
          <GiTopHat style={{width: "85%", height: "85%"}}/>
        </AvatarUpload>
        
        <Form onSubmit={handleSubmit}>
          
          <FormField>
            <Label>Username</Label>
            <Input 
              type="text" 
              placeholder={isProfileExists ? profile.username : "username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isProfileExists}
              required={!isProfileExists}
            />
            {isProfileExists && (
              <FieldNote>Username cannot be changed once set</FieldNote>
            )}
          </FormField>
          
          <FormField>
            <Label>Display Name</Label>
            <Input 
              type="text" 
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </FormField>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <SaveButton 
            type="submit"
            disabled={isSubmitting || (!isProfileExists && !username)}
          >
            {buttonText}
          </SaveButton>
        </Form>
      </EditorContent>
    </ProfileEditor>
  );
}

const ProfileEditor = styled.div`
  position: ${props => props.initialSetup ? 'relative' : 'fixed'};
  top: ${props => props.initialSetup ? 'auto' : '50%'};
  left: ${props => props.initialSetup ? 'auto' : '50%'};
  transform: ${props => props.initialSetup ? 'none' : 'translate(-50%, -50%)'};
  width: 100%;
  max-width: 600px;
  background-color: var(--background);
  border-radius: 16px;
  border: ${props => props.initialSetup ? 'none' : '1px solid var(--border-color)'};
  z-index: 1000;
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--foreground);
  font-size: 24px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const EditorTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-left: 16px;
`;

const EditorContent = styled.div`
  position: relative;
`;

const BannerUpload = styled.div`
  position: relative;
  height: 200px;
`;

const BannerPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--section-background);
`;

const AvatarUpload = styled.div`
  position: absolute;
  top: 150px;
  left: 16px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background-color: var(--background);
  border: 4px solid var(--background);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  padding: 80px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 15px;
`;

const Input = styled.input`
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  color: var(--foreground);
  
  &:focus {
    outline: none;
    border-color: var(--accent-blue);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FieldNote = styled.p`
  font-size: 13px;
  color: var(--secondary-text);
`;

const ErrorMessage = styled.div`
  color: #ff4040;
  font-size: 14px;
  padding: 8px 0;
`;

const SaveButton = styled.button`
  background-color: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 700;
  padding: 12px;
  margin-top: 16px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-blue-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;