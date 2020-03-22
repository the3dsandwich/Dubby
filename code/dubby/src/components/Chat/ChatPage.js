import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { firestore, auth } from "firebase";
import ChatCard from "./ChatCard";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../Navbar/Navbar";
import Loading from "../Loading/Loading";

const ChatPage = () => {
  const { userData, userLoading } = useContext(UserContext);

  const [chatList, setChatList] = useState();

  useEffect(() => {
    if (userData) {
      const { uid } = auth().currentUser;
      const unsubscribeChatList = firestore()
        .collection("user_profile")
        .doc(uid)
        .collection("chats")
        .onSnapshot(snap => {
          let tmp = [];
          snap.forEach(doc => tmp.push(doc.data()));
          setChatList(tmp);
        });
      return () => {
        unsubscribeChatList();
      };
    }
  }, [userData]);

  if (userLoading || !chatList) {
    return <Loading />;
  } else if (!userData) {
    return <Redirect to="/launch" />;
  } else {
    return (
      <div>
        <Navbar />
        <header>
          <h1>Chats</h1>
        </header>
        {chatList && chatList.length > 0 && (
          <ul>
            {chatList.map(chat => (
              <ChatCard key={chat.cid} cid={chat.cid} />
            ))}
          </ul>
        )}
      </div>
    );
  }
};

export default ChatPage;
