/*
 * Copyright 2021-2023 mtripg6666tdr
 * 
 * This file is part of mtripg6666tdr/Discord-SimpleMusicBot. 
 * (npm package name: 'discord-music-bot' / repository url: <https://github.com/mtripg6666tdr/Discord-SimpleMusicBot> )
 * 
 * mtripg6666tdr/Discord-SimpleMusicBot is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation, 
 * either version 3 of the License, or (at your option) any later version.
 *
 * mtripg6666tdr/Discord-SimpleMusicBot is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with mtripg6666tdr/Discord-SimpleMusicBot. 
 * If not, see <https://www.gnu.org/licenses/>.
 */

import type { CommandArgs } from "../Commands";
import type { AnyGuildTextChannel, Member, PermissionName } from "oceanic.js";

export const users = {
  getDisplayName(member: Member){
    return member.nick || member.username;
  },
  isDJ(member: Member, options: CommandArgs){
    return channels.sameVC(member, options) && member.roles.some(roleId => member.guild.roles.get(roleId).name === "DJ");
  },
  isPrivileged(member: Member){
    return member.permissions.has("MANAGE_GUILD")
      || member.permissions.has("MANAGE_CHANNELS")
      || member.permissions.has("ADMINISTRATOR");
  },
} as const;

const requirePermissions = [
  "SEND_MESSAGES",
  "EMBED_LINKS",
  "MANAGE_MESSAGES",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "VIEW_CHANNEL",
] as Readonly<PermissionName[]>;

export const channels = {
  checkSendable(channel: AnyGuildTextChannel, userId: string){
    const permissions = channel.permissionsOf(userId);
    return requirePermissions.every(permission => permissions.has(permission));
  },
  getVoiceMember(options: CommandArgs){
    if(!options.server.player.isConnecting) return null;
    return options.server.connectingVoiceChannel.voiceMembers || null;
  },
  sameVC(member: Member, options: CommandArgs){
    return this.getVoiceMember(options)?.has(member.id) || false;
  },
  voiceMemberCount(options: CommandArgs){
    return this.getVoiceMember(options)?.size || 0;
  },
  isOnlyListener(member: Member, options: CommandArgs){
    const vcMember = this.getVoiceMember(options);
    if(!vcMember) return false;
    if(vcMember.size > 2) return false;
    return vcMember.has(member.id);
  },
} as const;
