import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ChatMessage from "./ChatMessage";
import { List } from "react-bootstrap-icons";
import { analyze } from "../utils";
import './Chatbot.css';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            message: 'Hi, May i know your name?',
        },
    ]);

    const [text, setText] = useState("");

    const onSend = () => {
        let list = [...messages, { message: text, user: true }];
        if (list.length > 2) {
            const reply = analyze(text);
            list = [...list, { message: reply }];
        }
        else {
            list = [
                ...list,
                {
                    message: `Hi, ${text}`,
                },
                {
                    message: "How can i help you?",
                },
            ];
        }
        setMessages(list);
        setText("");
        setTimeout(() => {
            document.querySelector('#copyright').scrollIntoView();
        }, );
    };
    return (
        <div>
            
            <div className="image-container">
                 <img
                     src="https://media.istockphoto.com/id/1081316088/de/vektor/flache-vektor-icon-von-m%C3%A4dchen-mit-kopfh%C3%B6rern-f%C3%BCr-online-support.jpg?s=612x612&w=0&k=20&c=QlSrnvqg3MgaU6J6MdrvedMSy3CmMRXZYLmGL9mEUn8="
                     alt="logo"
                     height={150}
                     width={150}
                />
            </div>

            <h2 className='text-primary'>ChatWithUs</h2>

            <div className="chat-message">
                {messages.length > 0 && messages.map((data) => <ChatMessage {...data} />)}
                <div className="d-flex mt-2">
                    <input type="text" className="form-control" value={text} onChange={(e) => setText(e.target.value)} />
                    <Button type="primary" className="ms-3" onClick={onSend}>Send</Button>
                </div>
                <div id='copyright' className="mt-3"></div>
            </div>
        </div>
    );
}
