import { defineComponent } from 'vue'

const partners = ['Partner A','Partner B','Partner C','Partner D','Partner E']

export default defineComponent(() => () => (
  <section class="section" style={{background:'var(--card-soft)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
    <div class="container">
      <div style={{display:'flex',flexWrap:'wrap',gap:'20px',justifyContent:'center',color:'var(--muted)'}}>
        {partners.map(p => (
          <div style={{padding:'8px 14px',border:'1px dashed var(--border)',borderRadius:'12px'}}>{p}</div>
        ))}
      </div>
    </div>
  </section>
))

