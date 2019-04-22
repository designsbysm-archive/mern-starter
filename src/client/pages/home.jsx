import { apiRequest, errorHandler } from "../tools/http";
import React, { useState } from "react";

// components
import { ProgressCounter, ProgressSpinner } from "../components";

// assets
import "../styles/pages/home.scss";

const Page = props => {
  const initialProgress = 100;

  const [
    showSpinner,
    setShowSpinner, 
  ] = useState(true);

  const [
    showProgress,
    setShowProgress, 
  ] = useState(false);

  const [
    valueProgress,
    setValueProgress, 
  ] = useState(initialProgress);

  const simulateProgress = async value => {
    await apiRequest("/api/v1/mock/sleep/25")
      .then(() => {
        if (value <= 0) {
          setValueProgress(initialProgress);
          return setShowProgress(false);
        }

        setValueProgress(value - 1);
        simulateProgress(value - 1);
      })
      .catch(errorHandler);
  };

  return (
    <main className="contents home">
      <h3>Spinner</h3>
      <button
        onClick={() => {
          setShowSpinner(true);
          setShowProgress(false);
        }}
      >
        Show
      </button>
      <button onClick={() => setShowSpinner(false)}>Hide</button>
      <h3>Progress</h3>
      <button
        onClick={() => {
          setShowSpinner(false);
          setShowProgress(true);
          simulateProgress(valueProgress);
        }}
      >
        Show
      </button>
      <button onClick={() => setShowProgress(false)}>Hide</button>
      {showSpinner ? <ProgressSpinner /> : null}
      {showProgress ? (
        <ProgressCounter
          close={() => {
            setShowProgress(false);
            setValueProgress(false);
          }}
          max={initialProgress}
          value={valueProgress}
        />
      ) : null}
    </main>
  );
};

export default Page;
