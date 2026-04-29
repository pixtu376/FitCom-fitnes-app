import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import styles from "./Profile.module.css";

export default function Profile() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [showPass, setShowPass] = useState(false);

  const [info, setInfo] = useState({
    name: "", height: "", gender: "male", birth_day: "", diseases: "", login: ""
  });

  const [passData, setPassData] = useState({
    current_password: "", new_password: "", new_password_confirmation: ""
  });

  const [targets, setTargets] = useState({
    main: { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "main" },
    side: Array(4).fill(null).map(() => ({ stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "side" }))
  });

  const { data, isLoading } = useQuery({
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
        const side = u.targets.filter(t => t.type_target !== "main");
        setTargets({
          main: main || { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "main" },
          side: Array(4).fill(null).map((_, i) => side[i] || { stat_id: "", name_target: "", target_value: "", is_up: true, type_target: "side" })
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
      alert("Аватар обновлен");
    } catch (err) {
      alert("Ошибка при загрузке фото");
    }
  };

  const handleSaveInfo = async () => {
    try {
      await api.put("/user/profile", info);
      alert("Данные профиля обновлены");
      queryClient.invalidateQueries(["profileData"]);
    } catch (e) {
      alert("Ошибка при сохранении профиля");
    }
  };

  const handleSaveTargets = async () => {
    try {
      const payload = [
        { ...targets.main, type_target: "main" },
        ...targets.side.filter(s => s.stat_id).map(s => ({ ...s, type_target: "side" }))
      ];
      await api.post("/user/targets", { targets: payload });
      alert("Цели успешно обновлены");
      queryClient.invalidateQueries(["profileData"]);
    } catch (e) {
      console.error(e);
      alert("Ошибка базы данных при сохранении целей");
    }
  };

const handleChangePassword = async () => {
  // Проверяем, что новый пароль введен и подтвержден
  if (!passData.new_password || !passData.new_password_confirmation) {
    return alert("Введите новый пароль и его подтверждение");
  }

  if (passData.new_password !== passData.new_password_confirmation) {
    return alert("Новые пароли не совпадают!");
  }

  try {
    // Отправляем ТОЛЬКО новый пароль
    await api.post("/user/password", {
      new_password: passData.new_password,
      new_password_confirmation: passData.new_password_confirmation
    });
    
    alert("Пароль успешно изменен");
    
    // Очищаем только поля нового пароля
    setPassData({ 
      current_password: "", 
      new_password: "", 
      new_password_confirmation: "" 
    });
  } catch (e) {
    // Если ошибка 422, выводим подробности валидации из Laravel
    if (e.response && e.response.status === 422) {
      console.log("Ошибки валидации:", e.response.data.errors);
      alert("Ошибка: " + Object.values(e.response.data.errors).flat().join(", "));
    } else {
      alert(e.response?.data?.message || "Ошибка сервера");
    }
  }
};

  const handleLogout = async () => {
    if (!window.confirm("Вы уверены, что хотите выйти из аккаунта?")) return;
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  if (isLoading) return <div className={styles.loader}>Загрузка...</div>;

  const selectedIds = [targets.main.stat_id, ...targets.side.map(s => s.stat_id)].filter(Boolean);

  return (
    <div className={styles.container}>
      <Sidebar user={data?.user} />
      
      <main className={styles.mainContent}>
        <div className={styles.headerArea}>
          <h1 className={styles.pageTitle}>Настройки аккаунта</h1>
        </div>

        <div className={styles.grid}>
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className={styles.column}>
            {/* Карточка профиля */}
            <section className={styles.card}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                  <img src={data?.user?.avatar_url && data.user.avatar_url !== 'default.png' ? `http://localhost:8000/storage/avatars/${data.user.avatar_url}` : "/icons/user.svg"} className={styles.avatar} alt="User" />
                  <button className={styles.editAvatarBtn} onClick={() => fileInputRef.current.click()}>✎</button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" />
                </div>
                <div className={styles.loginBlock}>
                  <div className={styles.loginLabel}>Ваш логин</div>
                  <div className={styles.loginValue}>{info.login}</div>
                </div>
              </div>

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
                  <input type="number" autoComplete="off" className={styles.input} value={info.height} onChange={e => setInfo({...info, height: e.target.value})} />
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
                <label>Медицинские ограничения</label>
                <textarea className={styles.textarea} value={info.diseases} onChange={e => setInfo({...info, diseases: e.target.value})} />
              </div>

              <button className={styles.btnPrimary} onClick={handleSaveInfo}>Сохранить профиль</button>
            </section>

            {/* Карточка безопасности (теперь полностью масштабируемая) */}
            <section className={styles.card}>
  <h2 className={styles.cardTitle}>Безопасность</h2>
  
  <div className={styles.passBlock}>
    {/* Скрытое поле, чтобы браузер не подставлял рост вместо логина */}
    <input 
      type="text" 
      name="username" 
      autoComplete="username" 
      value={info.login} 
      readOnly 
      style={{ display: 'none' }} 
    />

    <div className={styles.passRow}>
      <div className={styles.field}>
        <label>Новый пароль</label>
        <div className={styles.relative}>
          <input 
            type={showPass ? "text" : "password"} 
            className={styles.input} 
            name="new_password"
            value={passData.new_password}
            autoComplete="new-password" // Говорим браузеру, что это форма создания пароля
            onChange={e => setPassData({...passData, new_password: e.target.value})}
          />
          <button 
            type="button" 
            className={styles.eyeBtn} 
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "✕" : "👁"}
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label>Подтвердите пароль</label>
        <input 
          type={showPass ? "text" : "password"} 
          className={styles.input} 
          name="new_password_confirmation"
          value={passData.new_password_confirmation}
          autoComplete="new-password"
          onChange={e => setPassData({...passData, new_password_confirmation: e.target.value})}
        />
      </div>
    </div>

    <div className={styles.actionButtons}>
      <button className={styles.btnOutline} onClick={handleChangePassword}>
        Сменить пароль
      </button>
      <button className={styles.btnDanger} onClick={handleLogout}>
        Выйти из аккаунта
      </button>
    </div>
  </div>
</section>
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className={styles.column}>
            {/* Карточка целей */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Цели отслеживания</h2>
              
              <div className={styles.targetSection}>
                <label className={styles.labelSmall}>Главная цель</label>
                <TargetRow 
                  item={targets.main} 
                  stats={data?.available_stats || []} 
                  selectedIds={selectedIds}
                  onUpdate={(val) => setTargets({...targets, main: val})} 
                />
              </div>

              <div className={styles.targetSection}>
                <label className={styles.labelSmall}>Побочные цели</label>
                {targets.side.map((s, i) => (
                  <TargetRow 
                    key={i} 
                    item={s} 
                    stats={data?.available_stats || []}
                    selectedIds={selectedIds}
                    onUpdate={(val) => {
                      const newSide = [...targets.side];
                      newSide[i] = val;
                      setTargets({...targets, side: newSide});
                    }} 
                  />
                ))}
              </div>

              <button className={styles.btnPrimary} style={{ marginTop: 'auto' }} onClick={handleSaveTargets}>Сохранить цели</button>
            </section>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}

function TargetRow({ item, stats, selectedIds, onUpdate }) {
  return (
    <div className={styles.targetRow}>
      <div className={styles.targetColSelect}>
        <select 
          value={item.stat_id} 
          onChange={e => {
            const s = stats.find(x => x.stat_id === e.target.value);
            onUpdate({...item, stat_id: e.target.value, name_target: s ? s.name_stat : ""});
          }}
          className={styles.select}
        >
          <option value="">Выберите...</option>
          {stats?.map(s => {
            const isTaken = selectedIds.includes(s.stat_id) && s.stat_id !== item.stat_id;
            return !isTaken ? <option key={s.stat_id} value={s.stat_id}>{s.name_stat}</option> : null;
          })}
        </select>
      </div>

      <div className={styles.targetColInput}>
        <input 
          type="number" 
          className={styles.input} 
          value={item.target_value} 
          placeholder="Значение"
          autoComplete="off"
          name={`target_val_${item.stat_id || Math.random()}`}
          onChange={e => onUpdate({...item, target_value: e.target.value})} 
        />
      </div>

      <div className={styles.targetColToggle}>
        <div className={styles.dirBox}>
          <button 
            className={`${styles.dirBtn} ${item.is_up ? styles.activeUp : ""}`} 
            onClick={() => onUpdate({...item, is_up: true})}
          >↑</button>
          <button 
            className={`${styles.dirBtn} ${!item.is_up ? styles.activeDown : ""}`} 
            onClick={() => onUpdate({...item, is_up: false})}
          >↓</button>
        </div>
      </div>
    </div>
  );
}