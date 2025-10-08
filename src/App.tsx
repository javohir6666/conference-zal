import { RouterView } from 'vue-router'
import { defineComponent, onMounted } from 'vue'
import Header from './components/Header'
import Footer from './components/Footer'
import { initReveal } from './lib/reveal'
import ChatBot from './components/ChatBot'
import TopBar from './components/TopBar'

export default defineComponent(() => {
  onMounted(() => initReveal())
  return () => (
    <div class="app">
      <TopBar />
      <Header />
      <main>
        <RouterView />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
})
