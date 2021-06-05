/* eslint-env jest */
const createGenerator = require('../src/utils/incremental-classnames');

it('generates incremental classnames', () => {
  const { getIncrementalClass } = createGenerator();
  const input = new Array(200).fill().map((_, index) => String(index));
  const output = (
    'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,' +
    'K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,' +
    'nb,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab,Bb,Cb,Db,Eb,Fb,Gb,Hb,Ib,Jb,Kb,' +
    'Lb,Mb,Nb,Ob,Pb,Qb,Rb,Sb,Tb,Ub,Vb,Wb,Xb,Yb,Zb,ac,bc,cc,dc,ec,fc,gc,hc,ic,' +
    'jc,kc,lc,mc,nc,oc,pc,qc,rc,sc,tc,uc,vc,wc,xc,yc,zc,Ac,Bc,Cc,Dc,Ec,Fc,Gc,' +
    'Hc,Ic,Jc,Kc,Lc,Mc,Nc,Oc,Pc,Qc,Rc,Sc,Tc,Uc,Vc,Wc,Xc,Yc,Zc,bd,cd,dd,ed,fd,' +
    'gd,hd,id,jd,kd,ld,md,nd,od,pd,qd,rd,sd,td,ud,vd,wd,xd,yd,zd,Bd,Cd,Dd,Ed,' +
    'Fd,Gd,Hd,Id,Jd,Kd,Ld,Md,Nd,Od,Pd,Qd,Rd,Sd,Td'
  ).split(',');
  expect(input.map(getIncrementalClass)).toEqual(output);
});

it('generates unique classnames', () => {
  const { getIncrementalClass } = createGenerator();
  const input = new Array(10000).fill().map((_, index) => String(index));
  const output = input.map(getIncrementalClass);
  const duplicates = output.filter((cls, i) => output.indexOf(cls) !== i);
  expect(duplicates).toEqual([]);
  expect(output.join('')).toEqual(expect.not.stringContaining('undefined'));
  const startsWithNumber = output.filter(cls => /^[0-9]/.test(cls));
  expect(startsWithNumber).toEqual([]);
  expect(output[output.length - 1]).toEqual('Nhd');
});
