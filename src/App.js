import React, { useState, useEffect, useRef } from 'react';
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
import { Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Block from '@mui/icons-material/Block';
import Chip from '@mui/material/Chip';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';



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


async function processText(senddata, gotdata, setGotdata, apiinfo, nextid, model) {
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
        "model": `${model}`,
        "messages": tmp.map(({ id, ...rest }) => rest)
      }
    }
  );
  setGotdata((d) => [...d, { "id": nextid, "role": "assistant", "content": response.choices[0].message.content }]);
}

function getNextId(senddata, gotdata) {
  if (senddata.length === 0 && gotdata.length === 0) {
    return 1;
  }
  const allItems = [...senddata, ...gotdata];
  const maxId = Math.max(...allItems.map(item => item.id));
  return maxId + 1;
}

async function checklogin(setLoggedin, apiinfo) {
  try {
    await AxiosSWR(
      "https://api.openai.com/v1/models",
      {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${apiinfo['apikey']}`,
          "OpenAI-Organization": `${apiinfo['Organization']}`,
        }
      }
    );
    setLoggedin(true)
  } catch {
    setLoggedin(false)
  }
}

function textsendingButtonEvent(senddata, gotdata, editid, inputText, setSenddata, setGotdata) {

  setSenddata((prev) => {
    if (editid === null) {
      return [...prev, { "id": getNextId(senddata, gotdata), "role": "user", "content": inputText }]
    } else {
      const idx = prev.findIndex((d) => d['id'] === editid);
      let updatedData = [...prev];
      updatedData[idx]['content'] = inputText;
      return updatedData
    }
  })
  if (editid !== null) {
    setGotdata((prev) => {
      prev.pop();
      const newdata = [...prev]
      return newdata
    })
  }
}

function EditButton(d, editid, setEditid, setInputText, isSending) {
  const elem = (children) => <Box sx={{display: 'flex', flexDirection: 'column'}}>{children}</Box>
  if (!editid) {
    return elem(
      <Button color='secondary' sx={{ marginLeft: '1em', marginTop: 'auto'  }} onClick={() => {
        setEditid(d['id'])
        setInputText(d['content'])
      }} variant='contained' disabled={isSending}
      >Edit</Button>
    )
  } else {
    return elem(<Button color='error' sx={{ marginLeft: '1em', marginTop: 'auto' }} variant='contained' onClick={() => {
      setEditid(null)
      setInputText('')
    }} disabled={isSending}>Cancel</Button>)
  }
}

export default function Home() {
  const [data, setData] = useState([]);
  const [model, setModel] = useState("gpt-4-1106-preview");
  const [senddata, setSenddata] = useState([]);
  const [gotdata, setGotdata] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [editid, setEditid] = useState(null);
  const [loggedin, setLoggedin] = useState(null);
  const [apiinfo, setApiinfo] = useState({ 'Organization': "", 'apikey': "" });
  const inputRef = useRef(null);
  const sendbuttonRef = useRef(null);

  useEffect(() => {
    setData(() => {
      const tmp = [...senddata, ...gotdata];
      tmp.sort((item1, item2) => item1.id - item2.id);
      return tmp
    })
  }, [senddata, gotdata])

  const handleSubmit = async () => {
    setIsSending(true);
    setError(null);
    try {
      await processText(senddata, gotdata, setGotdata, apiinfo, getNextId(senddata, gotdata), model);
    } catch (error) {
      setError(error.message);
      setSenddata((prev) => {
        prev.pop();
        const newdata = [...prev]
        return newdata
      })
    } finally {
      setIsSending(false);
      setInputText("");
      setEditid(null)
    }
  };

  useEffect(() => {
    if (senddata.length > 0) {
      handleSubmit()
    }
  }, [senddata])

  useEffect(() => {
    setApiinfo(() => ({ "apikey": localStorage.getItem('apikey'), "Organization": localStorage.getItem('Organization') }))
  }, [])

  checklogin(setLoggedin, apiinfo)

  useEffect(() => {
    checklogin(setLoggedin, apiinfo)
  }, [apiinfo])

  useEffect(() => {
    if (editid !== null && inputText !== "") {
      sendbuttonRef.current.scrollIntoView(false);
      inputRef.current.focus();
    }
  }, [editid, inputText])

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

  const enterPost = (keyEvent) => {
    if (keyEvent.key === 'Enter' && (keyEvent.ctrlKey || keyEvent.metaKey)) {
      textsendingButtonEvent(senddata, gotdata, editid, inputText, setSenddata, setGotdata)
    }
  }

  return (
    <Container maxWidth="md">
      <h1>ChatGPT Playground</h1>
      <Accordion sx={{marginBottom: '1em', maxWidth: '60%'}} elevation={2}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        ><span style={{marginLeft: '4px', marginRight: '2em', fontWeight: 700}}>API Config</span> {loggedin ? <><CheckCircleOutlineIcon color='success' sx={{marginRight: '4px'}}/>Logged in!</> : <><Block color='error' sx={{marginRight: '4px'}}/>Not logged in.</>}</AccordionSummary>
        <AccordionDetails>
          <Box>
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
              <Box style={{marginTop: "1em"}}>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Model</InputLabel>
                  <Select
                    onChange={(e) => setModel(e.target.value)}
                    value={model}
                    label="Model"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                  >
                    <MenuItem value="gpt-4-1106-preview">gpt-4-1106-preview</MenuItem>
                    <MenuItem value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</MenuItem>
                  </Select>
                </FormControl>
              </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ margin: '1em' }}>
        {data.map((d, index) => {
          return (
            <Box key={index}>
              <h2>{d.role}</h2>
              <Box sx={{display: 'flex'}}>
                <Box sx={{flex: 1, overflowX: 'auto'}}>
                  {d['role'] === 'user' ? renderTextWithLineBreaks(d.content) : 
                    <ReactMarkdown
                    children={d.content}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={dark}
                            language={match[1]}
                            PreTag="div"
                          />
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  />
                  }
                </Box>
                {d['id'] === Math.max(...senddata.map(item => item.id)) ? (
                  EditButton(d, editid, setEditid, setInputText, isSending)
                ) : <Box></Box>}
              </Box>
              <hr></hr>
            </Box>
          )
        })}
        {isSending ? <CircularProgress color="secondary" /> : ""}
      </Box>
      <Box>
        <Typography sx={{marginBottom: '1.5em', marginTop: '2em'}}>{editid ? <Chip label="Edit Mode" /> : ''}</Typography>
        <TextField
          id="outlined-multiline-flexible"
          inputRef={inputRef}
          label="message"
          multiline
          maxRows={1000}
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending} 
          onKeyDown={enterPost}
        />
        <Box flexDirection="row" justifyContent="flex-end" display="flex">
          <Button sx={{margin: '1em'}}
            onClick={() => textsendingButtonEvent(senddata, gotdata, editid, inputText, setSenddata, setGotdata)} variant="contained" disabled={isSending} >{isSending ? "sending..." : "send"}</Button>
        </Box>
      </Box>
      <Box ref={sendbuttonRef}></Box>
    </Container >
  );
}