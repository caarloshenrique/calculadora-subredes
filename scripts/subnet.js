const calc_ip = new Vue({
    el: '#primeira_parte',

    data: {
        nova_mascara: "-",
        hosts_validos_total: "-",
        hosts_validos: "-",
        sub_redes: "-"
    },

    methods: {
        calc: function () {
            //quebra a string do ip
            let ip_split = quebraString(document.getElementById('ip').value);

            //armazena a veracidade do IP
            let veracidade = verficaIp(ip_split[0], ip_split.length);

            if (veracidade != true) {
                alert("IP Inválido");
            } else {
                if (document.getElementById('quant').value > 64) {
                    alert("Impossível Criar esse Valor de Sub Redes");
                } else {
                    //armazena quanto serão utilizados para a sub rede
                    let bits_usados = calculaBits(document.getElementById('quant').value);

                    //armazena o valor do quarto octeto da máscara
                    let quarto_octeto = calculaOcteto(bits_usados);

                    //retorna a nova máscara
                    this.nova_mascara = `255.255.255.${quarto_octeto}`;

                    //calcula quantos bits restaram para host's
                    let restante_bits = 8 - bits_usados;

                    //calcular quantos host's estão disponíveis por sub rede
                    let h_valido = (Math.pow(2, restante_bits) - 2); //calcula quanto host's são válidos por sub rede

                    let x = Math.pow(2, bits_usados);

                    //calcular quantos host's estão disponíveis
                    let h_valido_total = ((Math.pow(2, restante_bits) * x) - 2 * x); //calcula quanto host's são válidos como um todo

                    //retorna os hosts válidos por sub rede e os hosts totais
                    this.hosts_validos = `${h_valido}`; //retorna para a camada de view a quantidade de host's válidos por sub rede
                    this.hosts_validos_total = `${h_valido_total}`; //retorna para a camada de view a quantidade de host's válidos no total

                    //retorna as sub redes criadas
                    this.sub_redes = exibeSubRedes(ip_split[0], ip_split[1], ip_split[2], h_valido, quarto_octeto);
                }
            }

        },
        clear: function () {
            this.nova_mascara = "-";
            this.hosts_validos = "-";
            this.hosts_validos_total = "-";
            this.sub_redes = "-";
            document.getElementById('ip').value = "";
            document.getElementById('quant').value = "";
        }
    }
});

const calp_sub_rede = new Vue({
    el: "#segunda_parte",

    data: {
        quant_sub_redes: "-",
        sub_redes: "-",
        mask: "-"
    },

    methods: {
        calcular: function () {
            //quebra o ip inserido
            let ip_split = quebraString(document.getElementById('ip_desejo').value);

            //armazena a veracidade do ip
            let veracidade = verficaIp(ip_split[0], ip_split.length);

            if (veracidade != true) {
                alert("IP inserido incorreto");
            } else {
                //armazena a quantidade de host's válidos por sub rede
                let hosts_p_subrede = parseInt(document.getElementById('quant_hosts').value);

                //armazena quantos bits serão necessário para a quantidade de host's necessária
                let bits_usados_host = calculaBits(hosts_p_subrede + 2);

                //armazena a quantidade de bits restante para sub rede
                let bits_subrede = 8 - bits_usados_host;

                //retorna o quantidade de sub redes criadas
                this.quant_sub_redes = Math.pow(2, bits_subrede);

                //calcula o valor do quarto octeto da máscara
                let octeto = calculaOcteto(bits_subrede);

                //retorna a nova máscara
                this.mask = `255.255.255.${octeto}`;

                //retorna as sub redes criadas.
                this.sub_redes = exibeSubRedes(ip_split[0], ip_split[1], ip_split[2], hosts_p_subrede, octeto);
            }
        },

        clear: function () {
            document.getElementById("ip_desejo").value = "";
            document.getElementById("quant_hosts").value = "";
            this.classe_ip = "-";
            this.quant_sub_redes = "-";
            this.sub_redes = "-";
            this.mask = "-";
        }
    }
});

const calc_mascara = new Vue({
    el: '#terceira_parte',

    data: {
        num_sub_redes: "-",
        sub_redes: "-"
    },

    methods: {
        exibir: function () {
            //quebra o ip inserido
            let ip_split = quebraString(document.getElementById('ip_entrada').value);

            //armazena a veracidade do IP
            let veracidade = verficaIp(ip_split[0], ip_split.length);

            if (veracidade != true) {
                alert("IP inserido incorreto");
            } else {
                //armazena a veracidade da máscara
                let veracidadeMask = verficaMascara(document.getElementById('mascara').value);
                if (veracidade != true) {
                    alert("Mascara Inválida");
                } else {
                    //quebra a máscara
                    mask_split = quebraString(document.getElementById('mascara').value);
                    let bitsOcteto = 0;
                    let y = 128;
                    let result = 0;

                    //calcula o número de bits utilizados para formar o valor do octeto, e consequentemente o número de bits para a sub rede
                    while (result != parseInt(mask_split[3])) {
                        bitsOcteto += 1;
                        result += y;
                        y = y / 2;
                    }

                    //armazena o numero de bits para os host's
                    let bits_p_hosts = 8 - bitsOcteto;

                    //calcula o número de host's válidos
                    let hosts = calculaHosts(bits_p_hosts) - 2;

                    //retorna o número de sub redes
                    this.num_sub_redes = Math.pow(2, bitsOcteto);

                    //retorna as sub redes criadas
                    this.sub_redes = exibeSubRedes(ip_split[0], ip_split[1], ip_split[2], hosts, parseInt(mask_split[3]));

                }
            }

        },

        clear: function () {
            document.getElementById('ip_entrada').value = "";
            document.getElementById('mascara').value = "";
            this.num_sub_redes = "-";
            this.sub_redes = "-";
        }
    }
})


//verifica se o IP é de classe C e se possui 4 octetos
function verficaIp(ip, tamanho) {
    if (ip > 191 && ip < 224 && tamanho == 4) {
        return true;
    } else {
        return false;
    }
}

//verifica se a máscara possui 4 octetos e se é uma máscara de classe C
function verficaMascara(mascara) {
    let mask_split = mascara.split(".");
    if (mask_split != 4 && mask_split[0] == 255 && mask_split[1] == 255 && mask_split[2] == 255) {
        return false;
    } else {
        return true;
    }
}

//função para gerar um vetor proveniente da dvisão de uma string de um . até outro .
function quebraString(entrada) {
    result = entrada
    return result.split(".");
}

//função para calcular o número de hosts mediante a passagem no numero de bits
function calculaHosts(num) {
    let x = 0;
    let result = 0;
    while (x < num) {
        x += 1;
        result = Math.pow(2, x);
    }
    return result;
}

//função para calcular o numero de bits que um número passado usa.
function calculaBits(num) {
    let bits = 0;
    let x = 0;
    while (x < num) {
        bits += 1;
        x = Math.pow(2, bits);
    }
    return bits;
}

//função para calcular o valor de um octeto de máscara mediante a passagem do número de bits.
function calculaOcteto(bits) {
    let cont = 0;
    let result = 0
    let check = 128;
    while (cont < bits) {
        result += check;
        check = check / 2;
        cont += 1;
    };
    return result;
}

//função que retorna um vetor para exibir as sub redes criadas, mediante a passagem dos 3 primeiros octetos de um IP, o número de host's válidos, e o valor do quarto octeto da máscara
function exibeSubRedes(oct1, oct2, oct3, hostsValidos, octeto) {
    let intervalo = hostsValidos + 2;

    let rede = 0 - intervalo;
    let primeiro_valido = 1;
    let ultimo_valido = hostsValidos;
    let broadcast = ultimo_valido + 1;
    let result = []

    while (rede < octeto) { //estrutura de repetição que adiciona os hosts de cada sub rede
        rede += intervalo;

        //retorna para a camada de visualização o ip de rede da sub rede
        result.push(`Rede: ${oct1}.${oct2}.${oct3}.${rede}`);

        //retorna para a camada de visualização os host's válidos da sub rede
        result.push(`Host's válidos: ${oct1}.${oct2}.${oct3}.${primeiro_valido} até ${oct1}.${oct2}.${oct3}.${ultimo_valido}`);

        //retorna para a camada de visualização o broadcast da sub rede
        result.push(`Broadcast: ${oct1}.${oct2}.${oct3}.${broadcast}`);

        result.push(`--`);

        console.log(result);

        //seta os parâmetros para a próxima sub rede
        primeiro_valido += intervalo;
        ultimo_valido += intervalo;
        broadcast += intervalo;
    };
    return result;
}