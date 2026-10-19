const $=s=>document.querySelector(s);
const fmt=n=>n.toLocaleString("vi-VN")+"đ";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nd=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase();
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

const COLORS={"Đen":"#222","Trắng":"#f2f2f2","Xanh navy":"#1f3a68","Be":"#d8c3a5","Đỏ đô":"#8e2a35","Xanh rêu":"#5b6b3a","Xám":"#8a8f94"};
const SEED=[
 ["Áo thun cổ tròn basic","Áo thun",159000,0,"Trắng",["S","M","L","XL"],"","Áo thun cổ tròn form vừa, thiết kế basic dễ phối đồ hằng ngày."],
 ["Áo thun oversize in chữ","Áo thun",229000,199000,"Đen",["M","L","XL"],"","Áo thun dáng oversize in chữ, phong cách trẻ trung, mặc rộng thoải mái."],
 ["Áo polo pique","Áo thun",289000,0,"Xanh navy",["S","M","L","XL"],"","Áo polo lịch sự, phù hợp đi làm và đi chơi cuối tuần."],
 ["Áo sơ mi linen tay dài","Áo sơ mi",349000,0,"Be",["S","M","L"],"","Áo sơ mi tay dài chất liệu linen, thoáng mát cho ngày nóng."],
 ["Áo sơ mi oxford kẻ","Áo sơ mi",379000,329000,"Xanh navy",["M","L","XL"],"","Áo sơ mi oxford họa tiết kẻ, lịch sự và dễ kết hợp."],
 ["Quần jeans ống suông","Quần",459000,0,"Xanh navy",["S","M","L","XL"],"","Quần jeans ống suông, dáng rộng thoải mái, dễ mặc."],
 ["Quần kaki slim fit","Quần",399000,0,"Be",["S","M","L","XL"],"","Quần kaki dáng slim fit gọn gàng, phù hợp đi học, đi làm."],
 ["Quần short thể thao","Quần",179000,0,"Xám",["S","M","L","XL"],"","Quần short thể thao nhẹ, thích hợp tập luyện và mặc ở nhà."],
 ["Áo khoác bomber","Áo khoác",589000,519000,"Xanh rêu",["M","L","XL"],"","Áo khoác bomber phong cách đường phố, giữ ấm nhẹ."],
 ["Áo hoodie nỉ bông","Áo khoác",419000,0,"Xám",["S","M","L","XL"],"","Áo hoodie nỉ bông ấm áp, có mũ, mặc thoải mái mùa lạnh."],
 ["Váy midi hoa nhí","Váy",369000,0,"Đỏ đô",["S","M","L"],"","Váy midi họa tiết hoa nhí, nữ tính, hợp đi chơi và dạo phố."],
 ["Chân váy chữ A","Váy",259000,0,"Đen",["S","M","L"],"","Chân váy chữ A đơn giản, dễ phối với áo sơ mi hoặc áo thun."]
].map((a,i)=>({id:i+1,name:a[0],cat:a[1],price:a[2],sale:a[3],color:a[4],sizes:a[5],img:a[6]||"",desc:a[7]||""}));

let products=load("vw_products",SEED), cart=load("vw_cart",[]), favs=load("vw_favs",[]), cmp=load("vw_cmp",[]), orders=load("vw_orders",[]);
let cat="Tất cả", favOnly=false, admin=false,editId=0;
const cur=p=>p.sale||p.price;
const nextCode=()=>{const n=load("vw_seq",0)+1;save("vw_seq",n);return"VW"+String(n).padStart(4,"0")};

/* ---------- Danh sách sản phẩm ---------- */
function shirt(c){return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M35 12 L12 24 L20 42 L30 38 L30 88 L70 88 L70 38 L80 42 L88 24 L65 12 Q50 24 35 12Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1.5" stroke-linejoin="round"/></svg>`}
const pic=p=>p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`:shirt(COLORS[p.color]||"#999");
function renderFilters(){
  const cats=["Tất cả",...new Set(products.map(p=>p.cat))];
  $("#cats").innerHTML=cats.map(c=>`<button class="chip ${c===cat&&!favOnly?"on":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const cs=[...new Set(products.map(p=>p.color))], v=$("#fColor").value;
  $("#fColor").innerHTML='<option value="">Mọi màu</option>'+cs.map(c=>`<option>${esc(c)}</option>`).join("");
  $("#fColor").value=cs.includes(v)?v:"";
}
function render(){
  const q=nd($("#q").value.trim()), sz=$("#fSize").value, co=$("#fColor").value, pr=$("#fPrice").value, so=$("#fSort").value;
  let list=products.filter(p=>(cat==="Tất cả"||p.cat===cat)&&(!favOnly||favs.includes(p.id))&&(!q||nd(p.name+" "+p.cat+" "+p.color).includes(q))&&(!sz||p.sizes.includes(sz))&&(!co||p.color===co));
  if(pr){const[a,b]=pr.split("-").map(Number);list=list.filter(p=>cur(p)>=a*1000&&cur(p)<b*1000)}
  if(so==="a")list.sort((x,y)=>cur(x)-cur(y));else if(so==="d")list.sort((x,y)=>cur(y)-cur(x));else if(so==="n")list.sort((x,y)=>x.name.localeCompare(y.name,"vi"));else list.sort((x,y)=>y.id-x.id);
  $("#grid").innerHTML=list.length?list.map(p=>`<article class="card">
   <div class="pic" style="background:color-mix(in srgb,${COLORS[p.color]||"#999"} 14%,var(--card))" data-det="${p.id}" title="Xem chi tiết">${pic(p)}
    <button class="fav ${favs.includes(p.id)?"on":""}" data-fav="${p.id}" aria-label="Yêu thích">${favs.includes(p.id)?"♥":"♡"}</button></div>
   <div class="info"><h3><button class="lnk" data-det="${p.id}">${esc(p.name)}</button></h3><div class="cat">${esc(p.cat)} · ${esc(p.color)}</div>
    <div class="price">${fmt(cur(p))}${p.sale?`<span class="old">${fmt(p.price)}</span>`:""}</div>
    <select data-size="${p.id}" aria-label="Chọn size">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
    <div class="row"><button class="pri" data-add="${p.id}">Thêm vào giỏ</button><button data-cmp="${p.id}">${cmp.includes(p.id)?"Bỏ so sánh":"So sánh"}</button></div></div></article>`).join(""):`<div class="empty">Không có sản phẩm phù hợp. Hãy thử bỏ bớt bộ lọc.</div>`;
  $("#nFav").textContent=favs.length;$("#nCmp").textContent=cmp.length;$("#nCart").textContent=cart.reduce((s,i)=>s+i.qty,0);
}
function addCart(id,size){const it=cart.find(i=>i.id===id&&i.size===size);it?it.qty++:cart.push({id,size,qty:1});save("vw_cart",cart);render();toast("Đã thêm vào giỏ hàng")}
function showDet(id){const p=products.find(x=>x.id===id);if(!p)return;
  $("#detBody").innerHTML=`<div class="det"><div class="pic" style="background:color-mix(in srgb,${COLORS[p.color]||"#999"} 14%,var(--card));border-radius:12px">${pic(p)}</div>
  <div style="display:flex;flex-direction:column;gap:8px"><h2 style="margin:0">${esc(p.name)}</h2><div class="cat">${esc(p.cat)} · Màu ${esc(p.color)}</div>
  <div class="price">${fmt(cur(p))}${p.sale?`<span class="old">${fmt(p.price)}</span>`:""}</div>
  <p>${esc(p.desc||"Sản phẩm thuộc nhóm "+p.cat+", màu "+p.color+". Mô tả chi tiết sẽ được cập nhật.")}</p>
  <label for="dSize">Size</label><select id="dSize">${p.sizes.map(z=>`<option>${esc(z)}</option>`).join("")}</select>
  <button class="pri" data-addd="${p.id}">Thêm vào giỏ</button></div></div>`;$("#dDet").showModal()}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)}

/* ---------- Giỏ hàng ---------- */
const PROVS=["Hà Nội", "Huế", "Lai Châu", "Điện Biên", "Sơn La", "Lạng Sơn", "Quảng Ninh", "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Cao Bằng", "Tuyên Quang", "Lào Cai", "Thái Nguyên", "Phú Thọ", "Bắc Ninh", "Hưng Yên", "Hải Phòng", "Ninh Bình", "Quảng Trị", "Đà Nẵng", "Quảng Ngãi", "Gia Lai", "Khánh Hòa", "Lâm Đồng", "Đắk Lắk", "TP. Hồ Chí Minh", "Đồng Nai", "Tây Ninh", "Cần Thơ", "Vĩnh Long", "Đồng Tháp", "Cà Mau", "An Giang"];
let coupon="",place={prov:"",dist:""};
function totals(){
  const sub=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?cur(p)*i.qty:0)},0);
  let disc=coupon==="VINA10"?Math.round(sub*.1):0;
  let s=!place.prov?0:(["TP. Hồ Chí Minh","Hà Nội"].includes(place.prov)?20000:35000);
  if(sub>=500000||coupon==="FREESHIP")s=0;
  return{sub,disc,ship:s,total:sub-disc+s};
}
function renderCart(){
  if(!cart.length){$("#cartBody").innerHTML='<div class="empty">Giỏ hàng đang trống. Chọn size rồi bấm "Thêm vào giỏ".</div>';return}
  const t=totals();
  $("#cartBody").innerHTML=cart.map((i,k)=>{const p=products.find(x=>x.id===i.id);if(!p)return"";return`<div class="line"><div class="n"><b>${esc(p.name)}</b><br><span class="cat">Size ${i.size} · ${fmt(cur(p))}</span></div>
   <div class="q"><button data-dec="${k}">−</button>${i.qty}<button data-inc="${k}">+</button></div><b>${fmt(cur(p)*i.qty)}</b><button data-del="${k}" aria-label="Xóa">✕</button></div>`}).join("")+`
   <div class="f"><div><label for="cp">Mã giảm giá (VINA10, FREESHIP)</label><input id="cp" value="${esc(coupon)}"></div><div style="align-self:end"><button id="apCp">Áp dụng</button></div></div>
   <div style="margin:14px 0"><div class="tot"><span>Tạm tính</span><span>${fmt(t.sub)}</span></div><div class="tot"><span>Giảm giá</span><span>−${fmt(t.disc)}</span></div>
   <div class="tot"><span>Phí vận chuyển</span><span>${place.prov?fmt(t.ship):"Chọn địa chỉ để tính"}</span></div><div class="tot big"><span>Tổng cộng</span><span>${fmt(t.total)}</span></div></div>
   <h3 style="margin:0">Thông tin giao hàng</h3>
   <div class="f" id="chk">
    <div><label for="cName">Họ tên</label><input id="cName" autocomplete="name"><div class="err" id="eName"></div></div>
    <div><label for="cPhone">Số điện thoại</label><input id="cPhone" inputmode="tel" autocomplete="tel"><div class="err" id="ePhone"></div></div>
    <div><label for="cProv">Tỉnh/thành</label><select id="cProv"><option value="">Chọn</option>${PROVS.map(p=>`<option ${p===place.prov?"selected":""}>${p}</option>`).join("")}</select><div class="err" id="eProv"></div></div>
    <div><label for="cDist">Phường/xã, quận/huyện</label><input id="cDist" value="${esc(place.dist)}" autocomplete="address-level2"><div class="err" id="eDist"></div></div>
    <div class="w"><label for="cAddr">Địa chỉ cụ thể</label><input id="cAddr" autocomplete="street-address"><div class="err" id="eAddr"></div></div>
    <div class="w"><button class="pri" id="order" style="width:100%;padding:11px">Đặt hàng (thanh toán khi nhận)</button></div></div>`;
}
function keepForm(){const g=id=>$(id)?$(id).value:"";return["#cName","#cPhone","#cAddr"].map(g)}
function rerenderCart(){const v=keepForm();renderCart();if($("#cName")){$("#cName").value=v[0];$("#cPhone").value=v[1];$("#cAddr").value=v[2]}render()}
function placeOrder(){
  const v=id=>$(id).value.trim();let ok=true;
  const chk=(id,e,test,msg)=>{const bad=!test(v(id));$(e).textContent=bad?msg:"";if(bad)ok=false};
  chk("#cName","#eName",s=>s.length>=2,"Nhập họ tên");
  chk("#cPhone","#ePhone",s=>/^(0|\+84)\d{9}$/.test(s.replace(/\s/g,"")),"Số điện thoại gồm 10 số, bắt đầu bằng 0");
  chk("#cProv","#eProv",s=>s,"Chọn tỉnh/thành");chk("#cDist","#eDist",s=>s,"Nhập phường/xã, quận/huyện");
  chk("#cAddr","#eAddr",s=>s.length>=5,"Nhập số nhà, tên đường");
  if(!ok)return;
  const t=totals();
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return{id:i.id,name:p?p.name:"?",size:i.size,qty:i.qty,price:p?cur(p):0}});
  orders.unshift({code:nextCode(),time:new Date().toLocaleString("vi-VN"),name:v("#cName"),phone:v("#cPhone"),addr:`${v("#cAddr")}, ${v("#cDist")}, ${v("#cProv")}`,
   lines,items:lines.map(l=>`${l.name} (${l.size}) x${l.qty}`).join("; "),sub:t.sub,disc:t.disc,ship:t.ship,total:t.total,status:"Mới"});
  save("vw_orders",orders);cart=[];coupon="";save("vw_cart",cart);
  $("#cartBody").innerHTML=`<div class="empty"><h3>Đặt hàng thành công</h3>Mã đơn <b>${orders[0].code}</b>. Chúng tôi sẽ gọi xác nhận trong ít phút.</div>`;render();
}

/* ---------- So sánh ---------- */
function renderCmp(){
  const L=cmp.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  $("#cmpBody").innerHTML=L.length<2?'<div class="empty">Chọn ít nhất 2 sản phẩm bằng nút "So sánh" (tối đa 3).</div>':
  `<table><tr><th></th>${L.map(p=>`<th>${esc(p.name)}</th>`).join("")}</tr>
  ${[["Danh mục",p=>esc(p.cat)],["Màu",p=>esc(p.color)],["Giá",p=>fmt(cur(p))],["Giảm giá",p=>p.sale?Math.round(100-p.sale/p.price*100)+"%":"Không"],["Size",p=>p.sizes.join(", ")]].map(r=>`<tr><th>${r[0]}</th>${L.map(p=>`<td>${r[1](p)}</td>`).join("")}</tr>`).join("")}</table>`;
}

/* ---------- Quản trị ---------- */
function renderAdm(){
  if(!admin){$("#admBody").innerHTML=`<p class="cat">Đăng nhập trình diễn: tài khoản <b>admin</b>, mật khẩu <b>123456</b>.</p><div class="f"><div><label for="aU">Tài khoản</label><input id="aU"></div><div><label for="aP">Mật khẩu</label><input id="aP" type="password"></div><div class="w"><div class="err" id="aE"></div><button class="pri" id="aGo">Đăng nhập</button></div></div>`;return}
  const rev=orders.filter(o=>o.status!=="Đã hủy").reduce((s,o)=>s+o.total,0);
  $("#admBody").innerHTML=`<div class="tot big"><span>${orders.length} đơn hàng</span><span>Doanh thu ${fmt(rev)}</span></div>
  <h3>Thêm sản phẩm</h3><div class="f"><div class="w"><label for="nN">Tên</label><input id="nN"></div>
  <div><label for="nC">Danh mục</label><input id="nC" list="cl" value="Áo thun"><datalist id="cl">${[...new Set(products.map(p=>p.cat))].map(c=>`<option value="${esc(c)}">`).join("")}</datalist></div>
  <div><label for="nM">Màu</label><select id="nM">${Object.keys(COLORS).map(c=>`<option>${c}</option>`).join("")}</select></div>
  <div><label for="nP">Giá (đồng)</label><input id="nP" type="number" min="1000"></div><div><label for="nS">Giá khuyến mãi (tùy chọn)</label><input id="nS" type="number" min="0"></div>
  <div class="w"><label for="nI">Đường dẫn ảnh (tùy chọn, ví dụ img/ao-thun.jpg)</label><input id="nI"></div><div class="w"><label for="nD">Mô tả</label><input id="nD"></div>
  <div class="w"><label for="nZ">Size (cách nhau bằng dấu phẩy)</label><input id="nZ" value="S, M, L, XL"></div>
  <div class="w"><div class="err" id="nE"></div><button class="pri" id="nAdd">Thêm sản phẩm</button></div></div>
  <h3>Sản phẩm (${products.length})</h3><div class="scroll"><table>${products.map(p=>`<tr><td>${esc(p.name)}</td><td>${fmt(cur(p))}</td><td><button data-ed="${p.id}">Sửa</button> <button data-rm="${p.id}">Xóa</button></td></tr>`).join("")}</table></div>
  <h3>Đơn hàng</h3>${orders.length?`<div class="scroll"><table><tr><th>Mã</th><th>Khách</th><th>Đơn</th><th>Tổng</th><th>Trạng thái</th></tr>${orders.map((o,k)=>`<tr><td>${o.code}<br><span class="cat">${esc(o.time)}</span></td><td>${esc(o.name)}<br>${esc(o.phone)}<br><span class="cat">${esc(o.addr)}</span></td><td>${esc(o.items)}</td><td>${fmt(o.total)}</td>
  <td><select data-st="${k}">${["Mới","Đang giao","Hoàn tất","Đã hủy"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</table></div>`:'<div class="empty">Chưa có đơn hàng nào.</div>'}
  <p><button id="aCsv">Xuất đơn hàng (CSV)</button> <button id="aOut">Đăng xuất</button></p>`;fillForm();
}

function fillForm(){const p=products.find(x=>x.id===editId);if(!p)return;const v=(i,x)=>{$(i).value=x};
  v("#nN",p.name);v("#nC",p.cat);v("#nM",p.color);v("#nP",p.price);v("#nS",p.sale||"");v("#nZ",p.sizes.join(", "));v("#nI",p.img||"");v("#nD",p.desc||"");
  $("#nAdd").textContent="Lưu thay đổi";$("#admBody h3").textContent="Sửa sản phẩm"}
/* ---------- Sự kiện ---------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,[data-det]");if(!t)return;const d=t.dataset;
  if("close" in d)t.closest("dialog").close();
  else if(d.det)showDet(+d.det);
  else if(d.cat){cat=d.cat;favOnly=false;renderFilters();render()}
  else if(d.fav){const id=+d.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save("vw_favs",favs);render()}
  else if(d.add)addCart(+d.add,document.querySelector(`[data-size="${+d.add}"]`).value);
  else if(d.addd){addCart(+d.addd,$("#dSize").value);$("#dDet").close()}
  else if(d.cmp){const id=+d.cmp;if(cmp.includes(id))cmp=cmp.filter(x=>x!==id);else if(cmp.length>=3)toast("Chỉ so sánh tối đa 3 sản phẩm");else cmp.push(id);save("vw_cmp",cmp);render()}
  else if(d.inc!==undefined){cart[+d.inc].qty++;save("vw_cart",cart);rerenderCart()}
  else if(d.dec!==undefined){const i=cart[+d.dec];i.qty>1?i.qty--:cart.splice(+d.dec,1);save("vw_cart",cart);rerenderCart()}
  else if(d.del!==undefined){cart.splice(+d.del,1);save("vw_cart",cart);rerenderCart()}
  else if(d.ed){editId=+d.ed;renderAdm();$("#nN").scrollIntoView({block:"center"})}
  else if(d.rm){if(!confirm("Xóa sản phẩm này?"))return;products=products.filter(p=>p.id!==+d.rm);cart=cart.filter(i=>i.id!==+d.rm);cmp=cmp.filter(x=>x!==+d.rm);favs=favs.filter(x=>x!==+d.rm);save("vw_products",products);save("vw_cart",cart);save("vw_cmp",cmp);save("vw_favs",favs);renderFilters();render();renderAdm()}
  else if(t.id==="apCp"){const c=$("#cp").value.trim().toUpperCase();if(c&&!["VINA10","FREESHIP"].includes(c)){toast("Mã giảm giá không hợp lệ");return}coupon=c;rerenderCart();toast(c?"Đã áp dụng mã":"Đã bỏ mã")}
  else if(t.id==="order")placeOrder();
  else if(t.id==="aGo"){if($("#aU").value==="admin"&&$("#aP").value==="123456"){admin=true;renderAdm()}else $("#aE").textContent="Sai tài khoản hoặc mật khẩu."}
  else if(t.id==="tGo")track();
  else if(t.id==="aCsv"){const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
    const rows=[["Mã","Thời gian","Khách","SĐT","Địa chỉ","Sản phẩm","Tạm tính","Giảm giá","Phí ship","Tổng","Trạng thái"],...orders.map(o=>[o.code,o.time,o.name,o.phone,o.addr,o.items,o.sub??"",o.disc??"",o.ship??"",o.total,o.status])];
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+rows.map(r=>r.map(q).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"}));a.download="don-hang.csv";a.click();URL.revokeObjectURL(a.href)}
  else if(t.id==="aOut"){admin=false;renderAdm()}
  else if(t.id==="nAdd"){const n=$("#nN").value.trim(),pr=+$("#nP").value,sa=+$("#nS").value||0,sz=[...new Set($("#nZ").value.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean))];
    if(n.length<2||!sz.length||pr<1000||(sa&&sa>=pr)){$("#nE").textContent="Nhập tên, giá từ 1.000đ trở lên; giá khuyến mãi phải thấp hơn giá gốc.";return}
    const o={name:n,cat:$("#nC").value.trim()||"Khác",price:pr,sale:sa,color:$("#nM").value,sizes:sz,img:$("#nI").value.trim(),desc:$("#nD").value.trim()};
    const ex=products.find(p=>p.id===editId);if(ex)Object.assign(ex,o);else products.push({id:Math.max(0,...products.map(p=>p.id))+1,...o});editId=0;
    save("vw_products",products);renderFilters();render();renderAdm();toast("Đã lưu sản phẩm")}
});
document.addEventListener("change",e=>{
  if(e.target.id==="cProv"){place={prov:e.target.value,dist:place.dist};rerenderCart()}
  else if(e.target.id==="cDist")place.dist=e.target.value;
  else if(e.target.dataset.st!==undefined){orders[+e.target.dataset.st].status=e.target.value;save("vw_orders",orders)}
});
$("#bCart").onclick=()=>{renderCart();$("#dCart").showModal()};
$("#bCmp").onclick=()=>{renderCmp();$("#dCmp").showModal()};
$("#bAdm").onclick=()=>{renderAdm();$("#dAdm").showModal()};
$("#bFav").onclick=()=>{favOnly=!favOnly;renderFilters();render();toast(favOnly?"Đang xem sản phẩm yêu thích":"Đã hiện tất cả")};
["#q","#fSize","#fColor","#fPrice","#fSort"].forEach(s=>$(s).addEventListener("input",render));
renderFilters();render();

function track(){const c=$("#tCode").value.trim().toUpperCase(),ph=$("#tPhone").value.replace(/\s/g,"");
  const o=orders.find(x=>x.code===c&&String(x.phone).replace(/\s/g,"")===ph);
  $("#tRes").innerHTML=o?`<p><b>${esc(o.code)}</b> · ${esc(o.time)}</p><p>Trạng thái: <b>${esc(o.status)}</b></p><p>${esc(o.items)}</p><p>Tổng thanh toán: <b>${fmt(o.total)}</b></p>`:`<p class="err">Không tìm thấy đơn hàng. Hãy kiểm tra lại mã đơn và số điện thoại.</p>`}
$("#bTrk").addEventListener("click",()=>{$("#tRes").innerHTML="";$("#dTrack").showModal()});
