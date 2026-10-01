export function semFoto(img?: HTMLImageElement) {
  if (img && !img.src.endsWith('sem-foto.svg')) {
    img.src = 'sem-foto.svg';
  }
}

export function fotoIndisponivel(evento: Event) {
  semFoto(evento.target as HTMLImageElement);
}
