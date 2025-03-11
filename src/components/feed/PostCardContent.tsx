
import React from 'react';

interface PostCardContentProps {
  title: string;
  content: string;
}

const PostCardContent = ({ title, content }: PostCardContentProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{content}</p>
    </div>
  );
};

export default PostCardContent;
