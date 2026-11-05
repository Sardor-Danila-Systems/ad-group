import sys,struct,json,re,os
def varint(b,i):
    r=0;s=0
    while True:
        c=b[i];i+=1;r|=(c&0x7f)<<s;s+=7
        if c<0x80:return r,i
def fields(b,start,end):
    i=start; out=[]
    while i<end:
        key,i=varint(b,i); fn,wt=key>>3,key&7
        if wt==0: v,i=varint(b,i); out.append((fn,'v',v))
        elif wt==1: out.append((fn,'d',struct.unpack('<d',b[i:i+8])[0])); i+=8
        elif wt==5: out.append((fn,'f',struct.unpack('<f',b[i:i+4])[0])); i+=4
        elif wt==2:
            l,i=varint(b,i); out.append((fn,'b',(i,i+l))); i+=l
        else: raise ValueError(wt)
    return out
swl=sys.argv[1]; out=sys.argv[2]; os.makedirs(out,exist_ok=True)
b=open(swl,'rb').read()
top=fields(b,0,len(b))
poses=[]
for fn,t,v in top:
    if fn==31 and t=='b':
        p={}
        for f2,t2,v2 in fields(b,*v):
            if t2=='f': p.setdefault(f'f{f2}',[]).append(v2)
            elif t2=='b':
                p[f'm{f2}']=[x[2] for x in fields(b,*v2) if x[1]=='f']
        poses.append(p)
starts=[m.start() for m in re.finditer(b"\xff\xd8\xff",b)]
imgs=[]
for i,s in enumerate(starts):
    end=starts[i+1] if i+1<len(starts) else len(b)
    c=b[s:end]; e=c.rfind(b"\xff\xd9"); c=c[:e+2]
    if len(c)>1000000:
        fn=f"{out}/shot{len(imgs)}.jpg"; open(fn,'wb').write(c); imgs.append(fn)
json.dump({"poses":poses,"images":imgs},open(f"{out}/poses.json","w"),indent=1)
print(len(poses),"poses",len(imgs),"images")
