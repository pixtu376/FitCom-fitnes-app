import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader";
import styles from "./Chat.module.css";

const MOBILE_BREAKPOINT = 1200;

export default function Chat() {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [activeContactId, setActiveContactId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const { data: contacts = [] } = useQuery({
    queryKey: ["chatContacts"],
    queryFn: () => api.get("/chat/contacts").then(res => res.data),
  });

  useEffect(() => {
    if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].user_id);
    }
  }, [contacts, activeContactId]);

  const { data: messages = [] } = useQuery({
    queryKey: ["chatMessages", activeContactId],
    queryFn: () => api.get(`/chat/messages?contact_id=${activeContactId}`).then(res => res.data),
    enabled: !!activeContactId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (newMsg) => api.post("/chat/messages", newMsg),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries(["chatMessages", activeContactId]);
    }
  });

  const activeContact = contacts.find(c => c.user_id === activeContactId);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeContactId) return;
    sendMessageMutation.mutate({
      receiver_id: activeContactId,
      message: messageText
    });
  };

  const handleAddContact = () => {
    const email = prompt("Введите email или login пользователя:");
    if (email) {
      alert("Запрос отправлен пользователю " + email);
    }
  };

  return (
    <div className={styles.layout}>
      {!isMobile && <div className={styles.sidebarDesktopWrapper}><Sidebar /></div>}
      <main className={styles.main}>
        {isMobile && <MobileHeader />}
        <div className={styles.chatPageContent}>
          
          <section className={styles.contactsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Контакты</h2>
              <button className={styles.addBtnCircle} onClick={handleAddContact}>
                +
              </button>
            </div>
            <div className={styles.wheelWrapper}>
              <div className={styles.wheel}>
                {contacts.map(contact => (
                  <div
                    key={contact.user_id}
                    className={`${styles.contactItem} ${activeContactId === contact.user_id ? styles.activeContact : ''}`}
                    onClick={() => setActiveContactId(contact.user_id)}
                  >
                    <div className={styles.avatarContainer}>
                        <img src={contact.avatar_url || "/icons/user.svg"} className={styles.contactAvatar} alt={contact.name} />
                        {contact.is_pinned && <span className={styles.pinIcon}>📌</span>}
                    </div>
                    <span className={styles.contactMiniName}>{contact.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className={styles.chatContainer}>
            <div className={styles.activeUserInfo}>
              {activeContact ? (
                <>
                  <div className={styles.activeUserMeta}>
                    <span className={styles.userName}>{activeContact.name}</span>
                    <span className={styles.onlineStatus}>в сети</span>
                  </div>
                  <a href={`/profile/${activeContact.chat_uuid}`} className={styles.profileLink}>Профиль</a>
                </>
              ) : (
                <span className={styles.userName}>Выберите собеседника</span>
              )}
            </div>

            <div className={styles.chatWindow}>
              <div className={styles.messagesList}>
                {messages.length > 0 ? messages.map((msg) => (
                  <div key={msg.id} className={`${styles.messageRow} ${msg.sender_id === activeContactId ? styles.msgIncoming : styles.msgOutgoing}`}>
                    <div className={styles.messageBubble}>
                      {msg.message}
                      <span className={styles.msgTime}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className={styles.emptyState}>Начните общение первым</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className={styles.chatInput}
                />
                <button
                  type="submit"
                  className={styles.sendBtn}
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? "..." : "⮕"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      {isMobile && <MobileNav />}
    </div>
  );
}