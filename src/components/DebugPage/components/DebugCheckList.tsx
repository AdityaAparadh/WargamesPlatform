import React, { useEffect, useState } from 'react';
import runCommand from '../../../utils/runCommand';
import CheckItem from './CheckItem';

interface DebugCheckListProps {
  onAllChecksComplete: () => void;
}

const DebugCheckList: React.FC<DebugCheckListProps> = ({ onAllChecksComplete }) => {
  const [dockerCheck, setDockerCheck] = useState<'loading' | 'success' | 'error'>('loading');
  const [internetCheck, setInternetCheck] = useState<'loading' | 'success' | 'error'>('loading');
  const [dockerError, setDockerError] = useState<string | null>(null);

  // Check if Docker is installed and running
  const checkDocker = async () => {
    try {
      setDockerCheck('loading');
      setDockerError(null);
      
      const result = await runCommand('docker ps');
      if (result.stderr) {
        setDockerCheck('error');
        setDockerError(result.stderr);
      } else {
        setDockerCheck('success');
      }
    } catch (error) {
      setDockerCheck('error');
      setDockerError('Failed to execute docker command');
      console.error('Docker check failed:', error);
    }
  };

  // Check if internet connection is available
  const checkInternet = async () => {
    try {
      setInternetCheck('loading');
      
      // Attempt to fetch a reliable endpoint
      await fetch('https://www.google.com', { 
        mode: 'no-cors',
        // Short timeout to avoid long waits on network issues
        signal: AbortSignal.timeout(5000)
      });
      setInternetCheck('success');
    } catch (error) {
      console.error('Internet check failed:', error);
      setInternetCheck('error');
    }
  };

  // Open external link in browser
  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Run checks when component mounts
  useEffect(() => {
    // Reset states
    setDockerCheck('loading');
    setInternetCheck('loading');
    setDockerError(null);
    
    // Add slight delay to make it look like it's "processing"
    const internetTimer = setTimeout(() => checkInternet(), 500);
    const dockerTimer = setTimeout(() => checkDocker(), 800);
    
    return () => {
      clearTimeout(dockerTimer);
      clearTimeout(internetTimer);
    };
  }, []);

  // Check if all tests have passed
  useEffect(() => {
    if (dockerCheck === 'success' && internetCheck === 'success') {
      onAllChecksComplete();
    }
  }, [dockerCheck, internetCheck, onAllChecksComplete]);

  return (
    <div className="debug-checklist">
      <CheckItem 
        title="Internet Connection"
        status={internetCheck}
        description="Verifying network connectivity..."
        errorMessage="No internet connection detected"
        helpAction={() => openExternalLink('https://wiki.archlinux.org/title/Network_Debugging')}
        helpText="Troubleshoot connection"
      />
      
      <CheckItem 
        title="Docker Engine"
        status={dockerCheck}
        description="Verifying Docker installation..."
        errorMessage={dockerError || "Docker is not installed or not running"}
        helpAction={() => openExternalLink('https://docs.docker.com/get-docker/')}
        helpText="Install Docker"
      />
    </div>
  );
};

export default DebugCheckList;
