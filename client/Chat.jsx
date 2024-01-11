import React, { useEffect, useState, useRef } from 'react';
import { chatServices } from './services/chat-services';
import { Grid, CircularProgress, Button} from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';

const styles = {
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#e3e3e3',
    textAlign: 'center',
    padding: '20px 0'
  }
}

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const hiddenFileInput = useRef(null);
    const [chatLog, setChatLog] = useState([]);
    const chatLogRef = useRef(null);

    const scrollIntoViewWithOffset = (selector, offset) => {
      window.scrollTo({
        behavior: 'smooth',
        top:
          selector.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          offset,
      })
    }

    const handleInputChange = (event) => {
        setError('');
        setUserInput(event.target.value);
    };

    const handlSendUserInput = async (event) => {
      setChatLog([
        ...chatLog,
        {
          chatPrompt: userInput,
          botMessage: null,
        },
      ]);
      try {
        setLoading(true);
          const { response } = await chatServices.chatWithLLM({ userInput });

          setChatLog([
            ...chatLog,
            {
              chatPrompt: userInput,
              botMessage: response,
            },
          ]);
          setUserInput('')
        } catch (err) {
          setError(err);
          return;
        } finally {
          setLoading(false);
        }
    }

    const handlUserInput = async (event) => {
      event.persist();
      if (event.key !== "Enter") {
          return;
      }
      if(userInput){
        handlSendUserInput()
      }

    };

    const handleUploadClick = (e) => {
      hiddenFileInput.current.click();
    }

    const handleButtonClick = async (e) => {
      if(userInput){
        handlSendUserInput()
      }
    }

    const handleFileChange = async (event) => {
      const fileUploaded = event.target.files[0];

      if (fileUploaded) {
        try {
          setLoading(true);
          const form = new FormData();
          form.append('chat-file', fileUploaded);

          const { success } = await chatServices.ingestFile({ fileInput: form })
          if (success) {
            setError('');
            setAnswer(`Successfully ingested, now ask me anything about ${fileUploaded.name}.`);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    }


    useEffect(() => {
        if (userInput != null && userInput.trim() === "") {
          setAnswer('');
        }
        if(chatLog.length){
          scrollIntoViewWithOffset(chatLogRef.current, 140)

        }


      }, [userInput, chatLog]);

    return (
<>


        {answer && <div className="govuk-notification-banner govuk-notification-banner--success fade-in" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
                <div className="govuk-notification-banner__content">
                  <p className="govuk-body" style={{maxWidth: '100%'}}>{answer}</p>
                </div>
              </div>}

          {chatLog.length > 0 ? (
        <div className="chatLogWrapper">
          {chatLog.length > 0 &&
            chatLog.map((chat, idx) => (
              <div key={idx}>
                <div className="fade-in">
                  <div className="govuk-heading-s govuk-!-static-margin-bottom-1">You</div>
                  <p>{chat.chatPrompt}</p>
                </div>
                { chat.botMessage && (
                <div className="fade-in">
                  <div className="govuk-heading-s govuk-!-static-margin-bottom-1">ChattyBot</div>
                  <p>{chat.botMessage}</p>
                </div>)}
                { loading && !chat.botMessage && <div>
                  <CircularProgress color="success" size="2rem" />
                </div> }

                <hr ref={chatLogRef} className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
              </div>
              )
            )}
                </div>
              ): (
                <div>{error}</div>
              )
            }

          {error && <p><strong>Something terrible happened!</strong></p>}


            <div style={styles.footer}>

            <div className="govuk-width-container">

            <div className="fade-in">
                  <button type="button" className="govuk-button button-svg"
                    style={{ position: 'absolute', height: '36px', width: '46px', backgroundColor: '#0b0c0c', marginTop: '2px'}}
                    onClick={handleUploadClick}
                    disabled={loading}
                  >
                    <svg style={{marginTop: '-3px'}}  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" baseProfile="tiny" fill="white" height="30px" id="Layer_1" version="1.2" viewBox="0 0 30 30" width="30px" xmlSpace="preserve"><g><path d="M18.364,6.635c-1.561-1.559-4.1-1.559-5.658,0L8.172,11.17c-0.473,0.473-0.733,1.1-0.733,1.77   c0,0.668,0.261,1.295,0.732,1.768c0.487,0.486,1.128,0.73,1.769,0.73c0.64,0,1.279-0.242,1.767-0.73l2.122-2.121   c0.391-0.395,0.586-0.904,0.586-1.414c0-0.512-0.195-1.023-0.586-1.414l-3.536,3.535c-0.193,0.195-0.511,0.195-0.708-0.002   c-0.127-0.127-0.146-0.275-0.146-0.352c0-0.078,0.019-0.227,0.146-0.354l4.535-4.537c0.778-0.779,2.048-0.779,2.83,0   c0.779,0.779,0.779,2.049,0,2.828l-4.537,4.537l-2.535,2.535c-0.779,0.779-2.049,0.779-2.828,0c-0.78-0.779-0.78-2.049,0-2.828   l0.095-0.096c-0.451-0.6-0.702-1.359-0.702-2.125l-0.807,0.807c-1.56,1.559-1.56,4.098,0,5.656c0.779,0.779,1.804,1.17,2.828,1.17   s2.049-0.391,2.828-1.17l7.072-7.072C19.924,10.732,19.924,8.195,18.364,6.635z"/></g></svg>
                  </button>
                    <input className="govuk-input govuk-!-width-full"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyDown={handlUserInput}
                      disabled={loading}
                      placeholder="Ask me anything..."
                      style={{ paddingLeft: '60px', paddingRight: '80px'}}
                    />
                    <button
                      type="button" className="govuk-button"
                      style={{ position: 'absolute', marginLeft: '-48px', width: '46px',  marginTop: '2px', height: '36px' }}
                      onClick={handleButtonClick}
                      disabled={loading}
                      >
                      Go
                    </button>
                    </div>



              <div style={{ display: 'none'}}>
                <input accept=".pdf,.txt,.csv" ref={hiddenFileInput} className="govuk-file-upload" id="file-upload-1" name="fileUpload1" type="file" onChange={handleFileChange} />
              </div>
              </div>
            </div>
        </>
    );
};

export { Chat };
