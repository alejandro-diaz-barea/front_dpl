import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrls: ['./chats-page.component.css']
})
export class ChatsPageComponent implements OnInit {
  chats: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats(): void {
    const token = this.authService.currentUserInfo?.access_token
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get<any[]>('http://127.0.0.1:8000/api/v1/chats', { headers })
        .subscribe(
          (response) => {
            console.log('Respuesta del servidor chats:', response);
            if (Array.isArray(response)) {
              this.chats = response;
            } else {
              this.chats = [];
            }
          },
          (error) => {
            console.error('Error al obtener los chats:', error);
          }
        );
    } else {
      console.error('Token de autenticación no encontrado.');
    }
  }

  getUserLogoPath(user: any): string {
    const baseUrl = 'http://127.0.0.1:8000/';
    return user?.logo_path ? `${baseUrl}${user.logo_path}` : '../../../../assets/profile-user.png';
  }

  getOtherUser(chat: any): any {
    const currentUserID = this.userInfo;
    return chat.user1.id === currentUserID ? chat.user2 : chat.user1;
  }

  getOtherUserName(chat: any): string {
    const currentUserID = this.userInfo;
    if (chat.user1.id === currentUserID) {
      return chat.user2.name;
    } else {
      return chat.user1.name;
    }
  }

  get userInfo(): number | undefined {
    return this.authService.currentUserInfo?.id;
  }

  navigateToMessages(chatId: number, otherName: string, url_photo: string ): void {
    this.router.navigate(['/chats/messages'], { queryParams: { chatId, otherName, url_photo } });
  }
}
