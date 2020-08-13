import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit{
  
  mensaje:string = '';
  elemeto: any;

  constructor( public _chatsService: ChatService ) { 
    this._chatsService.cargarMensajes().subscribe( ()=>{
      setTimeout(() => {
        this.elemeto.scrollTop = this.elemeto.scrollHeight;
      }, 20);
    });
  }
  
  ngOnInit(){
    this.elemeto = document.getElementById('app-mensajes');
  }

  enviarMensaje(){
    if( this.mensaje.length === 0 ){
      console.log('No has escrito ningun mensaje');
      return;
    }

    this._chatsService.agregarMensaje( this.mensaje )
        .then( resp =>{
          // console.log('Se inserto correctamente');
          this.mensaje = '';          
        }).catch(
          err =>{
            console.log('Hubo un error', err);
            
          }
        )

    
  }
  

}
