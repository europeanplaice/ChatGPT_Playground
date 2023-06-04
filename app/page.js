"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const AxiosSWR = async (url, options) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const renderTextWithLineBreaks = (text) => {
  const lines = text.split('\n');
  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};


  async function processText(text, senddata, gotdata, setGotdata, apiinfo, nextid) {
  const tmp = [...senddata, ...gotdata];
  tmp.sort((item1, item2) => item1.id - item2.id);

  const response = await AxiosSWR(
    "https://api.openai.com/v1/chat/completions",
    {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${apiinfo['apikey']}`,
        "OpenAI-Organization": `${apiinfo['Organization']}`,
        "Content-Type": "application/json"
      },
      data: {
        "model": "gpt-3.5-turbo",
        "messages": tmp.map(({ id, ...rest }) => rest)
      }
    }
  );
  setGotdata((d) => [...d, {"id": nextid, "role": "assistant", "content": response.choices[0].message.content }]);
}

function getNextId(senddata, gotdata) {
  if (senddata.length === 0 && gotdata.length === 0) {
    return 1;
  }
  const allItems = [...senddata, ...gotdata];
  const maxId = Math.max(...allItems.map(item => item.id));
  return maxId + 1;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [senddata, setSenddata] = useState([]);
  const [gotdata, setGotdata] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null); 
  const [apiinfo, setApiinfo] = useState({'Organization': "", 'apikey': ""}); 

  useEffect(() => {
    setData(() => {
      console.log("gotdata")
      console.log(gotdata)
      console.log("senddata")
      console.log(senddata)
      const tmp = [...senddata, ...gotdata];
      tmp.sort((item1, item2) => item1.id - item2.id);
      console.log('fulldata')
      console.log(tmp)
      return tmp
    })
  }, [senddata, gotdata])

  const handleSubmit = async () => {
    setIsSending(true);
    setError(null);
    try {
      await processText(inputText, senddata, gotdata, setGotdata, apiinfo, getNextId(senddata, gotdata));
    } catch (error) {
      setError(error.message);
      setSenddata((prev) => {
        prev.pop();
        return prev
      })
    } finally {
      setIsSending(false);
      setInputText("");
    }
  };

  useEffect(() => {
    if (senddata.length > 0) {
      handleSubmit()
    }
  }, [senddata])

  useEffect(() => {
    setApiinfo(() => ({"apikey": localStorage.getItem('apikey'), "Organization": localStorage.getItem('Organization')}))
  }, [])


  useEffect(() => {
    if (apiinfo['apikey'] !== "") {
      localStorage.setItem("apikey", apiinfo['apikey'])
    }
  }, [apiinfo['apikey']])

  useEffect(() => {
    if (apiinfo['Organization'] !== "") {
      localStorage.setItem("Organization", apiinfo['Organization'])
    }
  }, [apiinfo['Organization']])

  return (
    <Container maxWidth="md">
      <h1>Test ChatGPT</h1>
      <Accordion sx={{marginBottom: '1em', maxWidth: '60%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >API Config</AccordionSummary>
        <AccordionDetails>
          <TextField 
            label='Organization ID' 
            type="text" 
            sx={{marginRight: '4px', marginBottom: '8px'}} 
            value={apiinfo['Organization']}
            onChange={(e) => {setApiinfo((info) => ({...info, "Organization": e.target.value}))}}
            ></TextField>
          <TextField 
            label='API KEY' 
            type="password"
            sx={{marginBottom: '8px'}}
            value={apiinfo['apikey']}
            onChange={(e) => setApiinfo((info) => ({...info, "apikey": e.target.value}))}
            ></TextField>
        </AccordionDetails>
      </Accordion>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ margin: '1em' }}>
        {data.map((d, index) => {
          return (
            <Box key={index}>
              <h2>{d.role}</h2>
              <Box>
                {renderTextWithLineBreaks(d.content)}
              </Box>
              <hr></hr>
            </Box>
          )
        })}
        {isSending ? <CircularProgress color="secondary" /> : ""}
      </Box>
      <Box>
        <TextField
          id="outlined-multiline-flexible"
          label="message"
          multiline
          maxRows={100}
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending} 
        />
        <Button sx={{margin: '1em'}}
          onClick={() => {
            setSenddata((prev) => [...prev, {"id": getNextId(senddata, gotdata) ,"role": "user", "content": inputText }])
          }} variant="contained" disabled={isSending} >{isSending ? "sending..." : "send"}</Button>
      </Box>
    </Container>
  );
}