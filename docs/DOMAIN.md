# Company ke purane domain par nayi website lagana

Company ka domain pehle se hai aur us par abhi purani website chal rahi hai. Nayi website (Vercel par) us domain par purani ki jagah aayegi. Isme koi server login (SSH ya MobaXterm) nahi chahiye. Kaam Vercel ke dashboard aur us jagah ke DNS page par hota hai jahan domain ka DNS chal raha hai.

Sabse zaroori baat: **sirf website ka address badalna hai, email ko nahi chhedna.** Company ki email (jaise info@...) abhi jahan chal rahi hai wahin chalti rahe.

## A. Cutover se pehle taiyari (ek-do din pehle)
1. **Pata karo domain ka DNS kahan hai.** Domain registrar (GoDaddy, BigRock, Namecheap...) ya purani hosting ka panel (cPanel). Jahan "DNS Zone / DNS Management" dikhe wahi jagah hai. Uska login chahiye.
2. **Email kahan chal rahi hai pata karo.** Agar email purani hosting par hai, to purani hosting band mat karna. DNS me jo `MX`, `TXT` (SPF/DKIM) records hain unhe bilkul mat chhedna. **Nameservers Vercel par mat badalna**, warna email ke records chale jaate hain. Sirf `A` aur `CNAME` badalne hain.
3. **Purane DNS records ki photo/screenshot le lo** (khaaskar `A`, `CNAME`, `MX`, `TXT`), taaki kuch bigde to wapas daal sako.
4. **Purani website ka backup lo** (files aur agar database ho to wo bhi). Purani hosting tab tak band nahi karni jab tak nayi site aur email dono pakki tarah check na ho jaayein.
5. **TTL kam karo.** DNS records me `A` aur `www` ke TTL ko 300 second (5 minute) kar do. Isse switch jaldi dikhta hai aur gadbad hone par wapas bhi jaldi hota hai. Ye cutover se kam se kam ek din pehle karna.
6. **Purane URLs ki list banao.** Purani site ke jo pages Google par hain (sitemap ya Google Search Console se), unki list nikaalo. Agar nayi site me unke address alag hain to unhe purane address se naye par redirect karna padega, nahi to Google ka traffic aur ranking jaayegi. List mil jaaye to redirects code me jod diye jaate hain.

## B. Vercel me domain jodo (abhi site chalu rehti hai)
1. Vercel me project kholo, **Settings**, **Domains**, `yourdomain.com` aur `www.yourdomain.com` jodo.
2. Vercel "Invalid Configuration" dikhayega, ye abhi normal hai kyunki DNS purane jagah ja raha hai. Wo jo records maangta hai (`A` aur `CNAME`) unhe note kar lo. Aam taur par:
   - `A` record, naam `@`, value `76.76.21.21`
   - `CNAME` record, naam `www`, value `cname.vercel-dns.com`
3. Agar Vercel kahe ki domain kisi aur Vercel account me hai, to wo ek `TXT` record bata dega, use DNS me daal do.

## C. Cutover (switch ka din)
Kam traffic ke samay (raat ya early morning) karo.
1. DNS page me `@` ka purana `A` record badal kar Vercel wala `A` record rakho. `www` ka purana record badal kar Vercel wala `CNAME` rakho.
2. Baaki records (`MX`, `TXT` wagairah) jaise hain waise hi chhod do.
3. 5 se 30 minute me nayi site dikhne lagti hai (kabhi zyada). Vercel me hara tick aata hai aur HTTPS apne aap ban jaata hai.
4. Jab tak DNS poori duniya me nahi badla, kuch logon ko purani aur kuch ko nayi site dikhegi. Ye normal hai.

## D. Switch ke turant baad
1. **Main address chuno.** Vercel me `yourdomain.com` ya `www.yourdomain.com` me se ek ko main rakho, dusra usi par redirect ho. Purane `websiterecentresoft.vercel.app` ko bhi main domain par redirect karo, taaki Google ko site do copy me na dikhe.
2. **Website ko naya address batao.** Vercel me **Settings**, **Environment Variables** me Production ke liye `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` daalo (https ke saath, aakhir me slash nahi). Phir latest deployment par **Redeploy** karo. Isse sitemap, robots.txt, search aur share ke address, structured data aur Privacy Policy aur Terms ke andar ka address naye domain par badal jaata hai.
3. **reCAPTCHA:** Google reCAPTCHA me apni site kholo aur Settings me `yourdomain.com` aur `www.yourdomain.com` ko allowed domains me jodo. Nahi jodoge to contact form, careers form aur dono admin login me captcha error aayega.
4. **Google Search Console:** agar company ka pehle se Search Console hai to wahi use karo (domain wahi hai, isliye "change of address" nahi chahiye). Naya sitemap `https://yourdomain.com/sitemap.xml` submit karo aur purana sitemap hata do.

## E. Cutover ke baad check karo
- `https://yourdomain.com` aur `https://www.yourdomain.com` dono naya site kholte hain, padlock dikhta hai, aur ek doosre par redirect hota hai.
- Purane URLs (list wale) naye pages par redirect hote hain ya sahi page dikhate hain.
- **Email chal rahi hai:** company ki email par ek test mail bhejo aur wahan se bhi bhejo.
- Contact form aur job application bhejo, dono ki email aati hai.
- `https://yourdomain.com/robots.txt` me sitemap ki line naye domain ke saath hai.
- `/admin1` aur `/admin` me login hota hai. Domain badalne se cookie badal jaati hai, isliye sabko ek baar dobara login karna padega.

## F. Database ka kya hoga
Kuch nahi badalta. Upstash ko domain ka pata nahi hota, isliye content, users, roles, pages, messages aur activity log sab waise hi rehte hain.

## G. Wapas jaana ho to
Agar kuch bigde: DNS me `A` aur `www` ke purane records (jinki screenshot li thi) wapas daal do. TTL 5 minute rakha tha, isliye purani site jaldi wapas aa jaati hai.

## H. Baad me
1. Ek-do hafte baad jab sab theek ho, tab hi purani hosting band karo (agar email wahin nahi hai).
2. TTL wapas 1 ghante ya default par kar do.
3. Search Console me kuch hafte dhyan rakho ki purane URLs ke errors to nahi aa rahe.
