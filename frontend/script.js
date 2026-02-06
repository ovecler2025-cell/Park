// Tarih ve Saat
function updateDateTime(){
  const now = new Date();
  document.getElementById('current-date').innerText = now.toLocaleDateString();
  document.getElementById('current-time').innerText = now.toLocaleTimeString();
}
setInterval(updateDateTime,1000);
updateDateTime();

// Sekmeler
let currentTab='park';
document.querySelectorAll('.tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(tt=>tt.classList.remove('active'));
    t.classList.add('active');
    currentTab=t.dataset.tab;
  });
});

// Ekle Modal
const addModal = document.getElementById('add-modal');
document.getElementById('add-btn').addEventListener('click',()=>{
  addModal.style.display='flex';
  const fields = document.getElementById('add-fields');
  fields.innerHTML='';
  if(currentTab==='park'){
    fields.innerHTML=`
      <input type="text" name="baslik" placeholder="Başlık">
      <input type="date" name="tarih">
      <textarea name="aciklama" placeholder="Açıklama"></textarea>
      <input type="file" name="resimler" multiple>
    `;
  } else if(currentTab==='personel'){
    fields.innerHTML=`
      <input type="text" name="baslik" placeholder="Ad Soyad">
      <input type="date" name="baslangic">
      <input type="date" name="bitis">
      <textarea name="aciklama" placeholder="Açıklama"></textarea>
      <input type="file" name="resimler">
    `;
  } else {
    fields.innerHTML=`
      <textarea name="aciklama" placeholder="Açıklama"></textarea>
      <input type="date" name="tarih">
      <input type="file" name="resimler">
    `;
  }
});

document.getElementById('cancel-btn').addEventListener('click',()=>{ addModal.style.display='none'; });

// Form Submit
document.getElementById('add-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append('tab', currentTab);

  const res = await fetch('http://localhost:3000/add',{
    method:'POST',
    body: formData
  });
  const data = await res.json();
  if(data.success){
    alert('Başarılı! URL: '+data.urls.join(', '));
    addModal.style.display='none';
  } else {
    alert('Hata: '+data.error);
  }
});
