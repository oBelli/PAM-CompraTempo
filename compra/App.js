import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const [tempo, setTempo] = useState(0);              
  const [status, setStatus] = useState(false);       
  const [valor, setValor] = useState(0);               
  const [mostrarInput, setMostrarInput] = useState(false); 
  const [tempoEscolhido, setTempoEscolhido] = useState('');

  const TEMPO_MAXIMO = 60 * 60; // 60 minutos

  useEffect(() => {
    let interval;
    if (status) {
      interval = setInterval(() => {
        setTempo((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const adicionarTempoFixo = (minutos, custoFixo) => {
    const tempoAdicional = minutos * 60;
    if (tempo + tempoAdicional > TEMPO_MAXIMO) {
      alert('Limite máximo de 60 minutos atingido!');
      return;
    }
    setTempo((prev) => prev + tempoAdicional);
    setValor((prev) => prev + custoFixo);
    if (!status) setStatus(true);
  };

  const calcularCustoCustom = (minutos) => {
    if (minutos === 1) return 3.0;
    if (minutos === 2) return 5.0;

    let extras = minutos - 2;
    let custo = 5.0;
    if (extras <= 10) {
      custo += extras * 1.5;
    } else if (extras <= 20) {
      custo += 10 * 1.5 + (extras - 10) * (1.5 * 0.95);
    } else {
      custo += 10 * 1.5 + 10 * (1.5 * 0.95) + (extras - 20) * (1.5 * 0.90);
    }
    return custo;
  };

  const escolherTempo = () => {
    const minutos = parseInt(tempoEscolhido);
    if (isNaN(minutos) || minutos < 2) {
      alert('Digite um valor válido! Mínimo permitido: 2 minutos.');
      return;
    }
    const tempoAdicional = minutos * 60;
    if (tempo + tempoAdicional > TEMPO_MAXIMO) {
      alert('Limite máximo de 60 minutos atingido!');
      return;
    }

    const custoCustom = calcularCustoCustom(minutos);
    setTempo((prev) => prev + tempoAdicional);
    setValor((prev) => prev + custoCustom);
    setMostrarInput(false);
    setTempoEscolhido('');
    if (!status) setStatus(true);
  };

  const formatarTempo = (tempo) => {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos.toString().padStart(2, '0')} : ${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.caixaSenha}>
        <Text style={styles.senhaTitulo}>- Escolha seu tempo -</Text>
      </View>

      <View style={styles.caixaBotao}>
        <TouchableOpacity style={styles.botao} onPress={() => adicionarTempoFixo(1, 3)}>
          <Text style={styles.text}>Adicionar 1 Minuto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => adicionarTempoFixo(2, 5)}>
          <Text style={styles.text}>Adicionar 2 Minutos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setMostrarInput(true)}>
          <Text style={styles.text}>Escolha o Tempo</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.cronometro}>{formatarTempo(tempo)}</Text>
        <Text style={styles.valor}>Valor: R$ {valor.toFixed(2)}</Text>
      </View>

      {mostrarInput && (
        <View style={styles.caixaEscolha}>
          <TextInput
            style={styles.textoescolha}
            keyboardType="numeric"
            value={tempoEscolhido}
            onChangeText={setTempoEscolhido}
            placeholder="Minutos"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.botaoTempo} onPress={escolherTempo}>
            <Text style={styles.text}>Confirmar Tempo</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    padding: 16,
  },
  caixaSenha: {
    alignItems: 'center',
    gap: 10,
  },
  senhaTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  caixaBotao: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  botao: {
    backgroundColor: '#1db954',
    width: 280,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTempo: {
    backgroundColor: '#e53935',
    width: 220,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cronometro: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00e676',
    marginBottom: 10,
  },
  valor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  caixaEscolha: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  textoescolha: {
    borderColor: '#fff',
    borderWidth: 2,
    height: 45,
    width: 180,
    borderRadius: 8,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#1e1e1e',
  },
});
