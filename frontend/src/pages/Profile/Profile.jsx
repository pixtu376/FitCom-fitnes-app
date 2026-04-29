import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader";
import styles from "./Profile.module.css";

const MOBILE_BREAKPOINT = 1200;

export default function Profile() {
  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [showPass, setShowPass] = useState(false);

  const [info, setInfo] = useState({
    name: "", height: "", gender: "male", birth_day: "", diseases: "", login: ""
  });
  const [passData, setPassData] = useState({
    current_password: "", new_password: "", new_password_confirmation: ""
  });
  const [targets, setTargets] = useState({
    main: { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "main" },
    important: Array(4).fill(null).map(() => ({ stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "important" }))
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profileData"],
    queryFn: () => api.get("/user/profile").then(res => res.data)
  });

  useEffect(() => {
    if (data) {
      const u = data.user;
      setInfo({
        name: u.name || "",
        height: u.height || "",
        gender: u.gender || "male",
        birth_day: u.birth_day ? u.birth_day.split('T')[0] : "",
        diseases: u.diseases || "",
        login: u.email || u.login || ""
      });
      
      if (u.targets && u.targets.length > 0) {
        const main = u.targets.find(t => t.type_target === "main");
        const important = u.targets.filter(t => t.type_target !== "main");
        setTargets({
          main: main || { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "main" },
          important: Array(4).fill(null).map((_, i) => important[i] || { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "important" })
        });
      }
    }
  }, [data]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await api.post("/user/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      queryClient.invalidateQueries(["profileData"]);
    } catch (err) { alert("Ошибка при загрузке фото"); }
  };

  const handleSaveInfo = async () => {
    try {
      await api.put("/user/profile", info);
      alert("Профиль обновлен");
      queryClient.invalidateQueries(["profileData"]);
    } catch (e) { alert("Ошибка сохранения"); }
  };

  const handleSaveTargets = async () => {
    try {
      const payload = [
        { ...targets.main, type_target: "main" },
        ...targets.important.filter(s => s.stat_id).map(s => ({ ...s, type_target: "important" }))
      ];
      await api.post("/user/targets", { targets: payload });
      alert("Цели обновлены");
      queryClient.invalidateQueries(["profileData"]);
    } catch (e) { alert("Ошибка сохранения целей"); }
  };

  if (isLoading) return <div className="app-loader">Загрузка настроек...</div>;
  if (isError) return <div className="app-error"><p>{error.message}</p><button onClick={() => refetch()} className="app-btn-retry">Повторить</button></div>;

  const selectedIds = [targets.main.stat_id, ...targets.important.map(s => s.stat_id)].filter(Boolean);

  return (
    <div className={styles.layout}>
      {!isMobile && (
        <div className={styles.sidebarDesktopWrapper}>
          <Sidebar user={data?.user} />
        </div>
      )}
      
      <main className={styles.main}>
        {isMobile && <MobileHeader user={data?.user} />}
        
        <div className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <section className={`${styles.card} ${styles.infoCard}`}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                  <img 
                    src={data?.user?.avatar_url && data.user.avatar_url !== 'default.png' ? `http://localhost:8000/storage/avatars/${data.user.avatar_url}` : "/icons/user.svg"} 
                    className={styles.avatar} 
                    alt="User" 
                  />
                  <button className={styles.editAvatarBtn} onClick={() => fileInputRef.current.click()}>✎</button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" />
                </div>
                <div className={styles.loginBlock}>
                  <div className={styles.loginLabel}>Логин</div>
                  <div className={styles.loginValue}>{info.login}</div>
                </div>
              </div>

              <div className={styles.scrollArea}>
                <div className={styles.field}>
                  <label>ФИО</label>
                  <input type="text" className={styles.input} value={info.name} onChange={e => setInfo({...info, name: e.target.value})} />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Дата рождения</label>
                    <input type="date" className={styles.input} value={info.birth_day} onChange={e => setInfo({...info, birth_day: e.target.value})} />
                  </div>
                  <div className={styles.field}>
                    <label>Рост (см)</label>
                    <input type="number" className={styles.input} value={info.height} onChange={e => setInfo({...info, height: e.target.value})} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Пол</label>
                  <select className={styles.select} value={info.gender} onChange={e => setInfo({...info, gender: e.target.value})}>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Ограничения</label>
                  <textarea className={styles.textarea} value={info.diseases} onChange={e => setInfo({...info, diseases: e.target.value})} />
                </div>
              </div>

              <button className={styles.btnPrimary} onClick={handleSaveInfo}>Сохранить изменения</button>
            </section>
          </div>

          <div className={styles.rightCol}>
            <section className={`${styles.card} ${styles.targetCard}`}>
              <h3 className={styles.cardTitle}>Цели отслеживания</h3>
              <div className={styles.targetList}>
                <div className={styles.targetGroup}>
                  <span className={styles.labelSmall}>Главная цель</span>
                  <TargetRow item={targets.main} stats={data?.available_stats || []} selectedIds={selectedIds} onUpdate={(val) => setTargets({...targets, main: val})} />
                </div>
                <div className={styles.targetGroup}>
                  <span className={styles.labelSmall}>Важные показатели</span>
                  {targets.important.map((s, i) => (
                    <TargetRow key={i} item={s} stats={data?.available_stats || []} selectedIds={selectedIds} 
                      onUpdate={(val) => {
                        const newImp = [...targets.important];
                        newImp[i] = val;
                        setTargets({...targets, important: newImp});
                      }} 
                    />
                  ))}
                </div>
              </div>
              <button className={styles.btnPrimary} onClick={handleSaveTargets}>Обновить цели</button>
            </section>

            <section className={`${styles.card} ${styles.securityCard}`}>
              <h3 className={styles.cardTitle}>Безопасность</h3>
              <div className={styles.passRow}>
                <div className={styles.field}>
                  <label>Новый пароль</label>
                  <div className={styles.relative}>
                    <input type={showPass ? "text" : "password"} className={styles.input} value={passData.new_password} onChange={e => setPassData({...passData, new_password: e.target.value})} autoComplete="new-password"/>
                      <button 
                        type="button" 
                        className={styles.eyeBtn} 
                        onClick={() => setShowPass(!showPass)}
                        aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
                      >
                        {showPass ? <EyeClosed /> : <EyeOpen />}
                      </button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Повторите</label>
                  <input type={showPass ? "text" : "password"} className={styles.input} value={passData.new_password_confirmation} onChange={e => setPassData({...passData, new_password_confirmation: e.target.value})} autoComplete="new-password"/>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.btnOutline} onClick={() => alert('Пароль изменен')}>Сменить пароль</button>
                <button className={styles.btnDanger} onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>Выйти</button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {isMobile && <MobileNav />}
    </div>
  );
}

function TargetRow({ item, stats, selectedIds, onUpdate }) {
  return (
    <div className={styles.targetRow}>
      <div className={styles.targetColSelect}>
        <select value={item.stat_id} className={styles.select} onChange={e => {
          const s = stats.find(x => x.stat_id === e.target.value);
          onUpdate({...item, stat_id: e.target.value, name_target: s ? s.name_stat : ""});
        }}>
          <option value="">Выберите...</option>
          {stats?.map(s => {
            const isTaken = selectedIds.includes(s.stat_id) && s.stat_id !== item.stat_id;
            return !isTaken ? <option key={s.stat_id} value={s.stat_id}>{s.name_stat}</option> : null;
          })}
        </select>
      </div>
      <div className={styles.targetColInput}>
        <input type="number" className={styles.input} value={item.target_value} placeholder="0" onChange={e => onUpdate({...item, target_value: e.target.value})} />
      </div>
      <div className={styles.targetColToggle}>
        <div className={styles.dirBox}>
          <button className={`${styles.dirBtn} ${item.is_up ? styles.activeUp : ""}`} onClick={() => onUpdate({...item, is_up: true})}>↑</button>
          <button className={`${styles.dirBtn} ${!item.is_up ? styles.activeDown : ""}`} onClick={() => onUpdate({...item, is_up: false})}>↓</button>
        </div>
      </div>
    </div>
  );
}