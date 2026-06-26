import { useRef } from 'react';
import { Button } from './components/Button/Button';
import { StoryGallery } from './stories/utils/StoryGallery/StoryGallery';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: '20px 60px' }}>
      <div>
        {/*<SelectDelete.tsx*/}
        {/*  id={'2'}*/}
        {/*  options={options}*/}
        {/*  placeholder={'SelectDelete.tsx with input...'}*/}
        {/*  name={'cat'}*/}
        {/*  value={inputState}*/}
        {/*  onChange={setInputState}*/}
        {/*></SelectDelete.tsx>*/}
      </div>
      <div style={{ width: '300px', height: '300px' }}>
        <br />

        <FormTest />
        <br />
        <br />
        <Select
          id={'13'}
          value={inputState}
          onChange={setInputState}
          options={options}
          name={'selectMenu'}
          placeholder={'Select Menu'}
          label={'Select your fav animal'}
          searchable={true}
          // withFreeText={true}
          // disabled={true}
        />
      </div>
      <br />

      {/*<Input*/}
      {/*  labelText="Last Name"*/}
      {/*  type={'text'}*/}
      {/*  name={'lastName'}*/}
      {/*  value={inputState}*/}
      {/*  onChange={setInputState}*/}
      {/*  id={'12345'}*/}
      {/*  showPassword={true}*/}
      {/*  clearInput={true}*/}
      {/*  //error={errorMsg}*/}
      {/*  // onClearInput={clearErrorMsg}*/}
      {/*  //normalizeValue={capitalize}*/}
      {/*  placeholder={'Enter your last name'}*/}
      {/*/>*/}
      {/*<StoryGallery>*/}
      {/*  <Button*/}
      {/*    variant="solid"*/}
      {/*    intent="primary"*/}
      {/*    ref={myRef}*/}
      {/*    tooltipText="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."*/}
      {/*    tooltipAlignment="end"*/}
      {/*    tooltipPosition="bottom"*/}
      {/*  >*/}
      {/*    Button*/}
      {/*  </Button>*/}
      {/*  <Button variant="solid" intent="neutral">*/}
      {/*    Button*/}
      {/*  </Button>*/}
      {/*  <Button variant="solid" intent="danger">*/}
      {/*    Button*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    variant="solid"*/}
      {/*    intent="warning"*/}
      {/*    tooltipText="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."*/}
      {/*    tooltipPosition="bottom"*/}
      {/*    tooltipAlignment="end"*/}
      {/*  >*/}
      {/*    Button Button*/}
      {/*  </Button>*/}
      {/*</StoryGallery>*/}
    </div>
  );
};
