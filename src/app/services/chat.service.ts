import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { MensajeModel } from '../models/mensaje.model';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private itemsCollection: AngularFirestoreCollection<MensajeModel>
  public chats: MensajeModel[] = [];
  public usuario: any = {};

  constructor( private firestore: AngularFirestore,
               public auth: AngularFireAuth ) {
                
                this.auth.authState.subscribe( user =>{
                  // console.log('Estado del usuario:', user);
                  
                  if( !user ){
                    return;
                  }

                  this.usuario.nombre = user.displayName;
                  this.usuario.uid = user.uid;

                });

                }
  
  login( proveedor:string ) {
    if( proveedor === 'google' ){
      this.auth.signInWithPopup( new auth.GoogleAuthProvider() );
    }else if( proveedor === 'facebook' ){
      this.auth.signInWithPopup( new auth.FacebookAuthProvider() );
    }else{
      // console.log( proveedor, ':Proveedor no configurado' );
    }
  }
  
  logout() {
    this.usuario = {};
    this.auth.signOut();
  }               
  

  cargarMensajes(){
    this.itemsCollection = this.firestore.collection<MensajeModel>( 'chats',
                                                                      ref => ref.orderBy('fecha', 'desc')
                                                                      .limit(5) );
    return this.itemsCollection.valueChanges()
            .pipe(
              map( 
                ( mensajes: MensajeModel[] ) => {

                  this.chats = [];

                  for (const mensaje of mensajes) {
                    this.chats.unshift( mensaje );
                  }
                  // console.log(this.chats);
                  
                  return this.chats;
                }
              )
            );
  }

  agregarMensaje( texto: string ){
    let mensaje: MensajeModel = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    } 

    return this.itemsCollection.add( mensaje );
  }

}
