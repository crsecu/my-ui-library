import { useRef } from 'react';
import { Button } from './components/Button/Button';
import { StoryGallery } from './stories/utils/StoryGallery/StoryGallery';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  return (
    <StoryGallery>
      <Button
        variant="solid"
        intent="primary"
        ref={myRef}
        tooltipText="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
        tooltipAlignment="end"
      >
        Button
      </Button>
      <Button variant="solid" intent="success" tooltipText="Hello World">
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
