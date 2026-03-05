import { useRef } from 'react';
import { Button } from './components/Button/Button';
import { StoryGallery } from './components/StoryGallery/StoryGallery';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  return (
    <StoryGallery>
      <Button variant="solid" intent="primary">
        Button
      </Button>
      <Button variant="solid" intent="success">
        Button
      </Button>
      <Button variant="solid" intent="neutral">
        Button
      </Button>
      <Button variant="solid" intent="danger">
        Button
      </Button>
      <Button variant="solid" intent="warning">
        Button
      </Button>
    </StoryGallery>
  );
};
