import React from 'react';

interface MultimediaContentProps {
  content: string;
}

const MultimediaContent: React.FC<MultimediaContentProps> = ({ content }) => {
  return (
    <div className="multimedia-content">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default MultimediaContent;
