import style from './layout.module.css';

export default async function AuthLayout({ 
  children 
} : { 
  children: React.ReactNode
}) {
  return (
    <div className={style.layout}>
      {children}
    </div>
  );
}
