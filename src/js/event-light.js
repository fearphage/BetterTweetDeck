const ev = ['TD',
'dataDeciderUpdated',
'flushscribe',
'mouseup',
'submit',
'uiNavigate',
'scribeEvent',
'dataStorageSet',
'dataStorageGet',
'ddgImpression',
'dataTwitterAccountAccessSuccess',
'dataTwitterAccountAccessDenied',
'uiNeedsSingleAccountStatus',
'dataClientsUpdated',
'dataContributeeInviteSuccess',
'dataAccountWhitelist',
'uiAccountAction',
'dataContributorActionSuccess',
'dataCustomTimelineSuccess',
'dataCustomTimelineError',
'uiAddColumnsByUrl',
'uiDeleteColumnAction',
'uiMoveColumnAction',
'uiNeedsSerializedColumn',
'uiNeedsHelpConfiguration',
'uiNeedsContributees',
'uiRemoveContributee',
'uiNeedsContributors',
'uiContributorAction',
'uiEmbedTimelineAction',
'uiNeedsEmbeddedTweet',
'uiHidingMessageBanner',
'dataMessages',
'uiNeedsPreferredAccount',
'uiNeedsRelationship',
'uiNeedsFavoriteState',
'uiFavoriteTweet',
'uiUnfavoriteTweet',
'uiNeedsTwitterUser',
'uiFollowAction',
'uiUnfollowAction',
'uiBlockAction',
'uiUnblockAction',
'uiReportSpamAction',
'uiReportCompromisedAction',
'dataSettingsValues',
'uiNeedsSettings',
'uiToggleTheme',
'uiNavbarWidthChangeAction',
'dataReceivedStreamData',
'uiNeedsUserSearch',
'uiSearch',
'uiRecentSearchClearAction',
'uiNeedsRecentSearches',
'uiNeedsTypeaheadSuggestions',
'dataTypeaheadQueryReset',
'dataTypeaheadUserPrefetchComplete',
'dataStorageItem',
'dataTwitterClientChanged',
'dataStorageFull',
'dataRecentSearches',
'dataSubscribedLists',
'uiNeedsUserProfileSocialProof',
'uiNeedsTwitterUsers',
'uiNeedsSubscribedLists',
'uiSendTweet',
'uiRetweet',
'uiUndoRetweet',
'uiSendScheduledTweets',
'uiDeleteScheduledTweetGroup',
'uiEditScheduledTweetGroup',
'uiDeleteDm',
'uiDeleteConversation',
'uiMarkDmAsRead',
'uiMarkAllDmsAsRead',
'uiSendDm',
'uiAddConversationParticipants',
'uiUpdateConversationName',
'uiConversationsDisableNotifications',
'uiConversationsEnableNotifications',
'uiLoginRequest',
'uiTweetDeckForgotPasswordRequest',
'uiNeedsDataminrAuth',
'uiNeedsDataminrWatchlists',
'uiNeedsDataminrAlerts',
'uiAddTweetToCustomTimeline',
'uiRemoveTweetFromCustomTimeline',
'uiNeedsCustomTimeline',
'uiUpdateCustomTimeline',
'dataAddTweetToCustomTimelineError',
'dataRemoveTweetToCustomTimelineError',
'uiNeedsSecureImageUrl',
'uiNeedsDMReport',
'uiNeedsSchemaValidation',
'dataAccountsRewriteColumns',
'dataApiResponse',
'uiUmfPromptActedOn',
'uiDismissMessageAction',
'uiLogout',
'uiLogin',
'uiSelectDefaultAccount',
'uiClearColumnAction',
'uiActionFilterError',
'dataTweetSent',
'dataDmSent',
'dataScheduledTweetsSent',
'uiRemoveInReplyTo',
'uiComposeStackReply',
'uiDockedComposeTweet',
'dataCustomTimelineCreateSuccess',
'dataCustomTimelineUpdateSuccess',
'dataCustomTimelineDeleteSuccess',
'dataAddTweetToCustomTimelineSuccess',
'dataRemoveTweetFromCustomTimelineSuccess',
'uiShowMessageBanner',
'uiClickMessageButtonAction',
'uiShowEmbedTweet',
'uiTypeaheadDropdownInvoked',
'uiTypeaheadItemSelected',
'uiShowSocialProof',
'uiShowReportTweetOptions',
'uiShowReportTweetCancel',
'uiReportAbusiveAction',
'uiReportAbusiveOption',
'uiShowReportMessageCancel',
'uiShowReportMessageError',
'scribing',
'uiNeedsModalContext',
'uiShowProfile',
'uiShowImportColumnDialog',
'uiShowAddColumn',
'uiShowGlobalSettings',
'uiShowKeyboardShortcutList',
'uiShowAccountSharedWarning',
'uiShowFollowFromOptions',
'uiShowFavoriteFromOptions',
'unload',
'dataSettings',
'dataColumnFeedUpdated',
'uiTrendsFor',
'uiMigrateActive',
'uiNeedsMigrateData',
'uiNeedsMigratePreviewData',
'uiMigrateTweetDeckData',
'uiMigrateTwitterData',
'uiMigrateSuccess',
'uiMigrateCancel',
'uiCloseModal',
'uiMigrateStart',
'uiMigrateEducationContinue',
'uiMigrateEducationCancel',
'uiMigrateRiskSingleContinue',
'uiMigrateRiskMultipleContinue',
'uiMigrateRiskCancel',
'uiMigrateTeamOrganiserContinue',
'uiMigrateTeamMemberContinue',
'uiMigrationTeamCancel',
'uiMigrateTeamInstructionsContinue',
'uiMigrationTeamInstructionsCancel',
'uiMigrateTeamMemberLogoutContinue',
'uiMigrateTeamMemberOkContinue',
'uiMigrateTeamMemberCancel',
'uiMigrateRiskAgreementContinue',
'uiMigrateRiskAgreementCancel',
'uiMigrateProgressNext',
'uiMigrateProgressDone',
'uiMigrateProgressCancel',
'uiMigrateProgressTeamSetup',
'dataNeedsMigrateCompleteConfirmation',
'uiMigrateError',
'dataContributees',
'uiContributeeInviteAccept',
'dataUndoRetweetSuccess',
'dataUndoRetweetError',
'uiColumnNavSizeOverflow',
'uiColumnNavSizeNormal',
'uiVisibleChirps',
'uiNeedsScheduledColumnVisible',
'uiNeedsColumnOrder',
'uiNeedsColumns',
'dataRateLimit',
'dataThrottleFeed',
'dataUserStreamStatus',
'dataAppWokenFromSleep',
'dataTwitterAccountAccessEnabled',
'uiNeedsFeatureCustomTimelines',
'uiFeatureCustomTimelines',
'uiFocusRequest',
'uiFocusRelease',
'dragstart',
'dragend',
'uiDragStart',
'uiDragEnd',
'drop',
'dragenter',
'dragleave',
'dragover',
'uiMessageBannerShown',
'uiMessageBannerResized',
'dataTwitterAccountSuspended',
'dataMessage',
'uiMessageBannerContainerHidden',
'dataMessageRemove',
'uiShowConfirmationDialog',
'uiTwitterProfileClosing',
'uiMediaGalleryClosing',
'uiDetailViewClosing',
'uiShowActionsMenu',
'uiFocus',
'uiKeyEscape',
'uiDetailViewOpening',
'uiDropdownShowing',
'uiKeySpace',
'uiKeyEnter',
'uiKeyUp',
'uiKeyDown',
'uiKeyLeft',
'uiKeyRight',
'uiColumnRendered',
'dataColumnOrder',
'uiShowDmParticipants',
'uiMessageThreadRead',
'uiMessageUnreadCount',
'dataSerializedColumn',
'uiColumnUpdateMediaPreview',
'uiColumnVisibilities',
'uiColumnChirpsChanged',
'visibilitychange',
'uiDrawerTransitionComplete',
'uiToggleNavBarWidth',
'uiColumnMoving',
'uiGridBack',
'uiGridClearSelection',
'uiColumnFocus',
'uiGridPageDown',
'uiGridPageUp',
'uiGridHome',
'uiGridEnd',
'uiGridReply',
'uiGridFavorite',
'uiGridFavoriteFromAccounts',
'uiGridRetweet',
'uiGridDirectMessage',
'uiGridProfile',
'uiGridCustomTimeline',
'uiGridContextMenu',
'uiDetailViewActive',
'uiDetailViewClosed',
'uiSkipToReplies',
'dataColumns',
'uiColumnsScrollToColumn',
'uiColumnsScrollColumnToCenter',
'uiColumnsScrollToChirp',
'uiResetImageUpload',
'uiComposeAddImageClick',
'uiComposeImageAdded',
'change',
'uiToggleNavbarWidth',
'uiInvitedContributeeAccounts',
'uiDrawerActive',
'uiComposeTweet',
'uiFilesAdded',
'uiDrawerHideDrawer',
'uiDrawerShowDrawer',
'uiShowAccountSettings',
'dataTypeaheadSuggestions',
'uiComposeClose',
'uiComposeFilesAdded',
'uiRemoveQuotedTweet',
'uiMainWindowResized',
'uiComposeScheduleStateChange',
'dataTweetError',
'dataDmError',
'dataScheduledTweetsError',
'dataCachedTwitterUser',
'dataForgotPasswordSuccess',
'dataForgotPasswordError',
'dataContributors',
'dataContributorsError',
'dataContributeeNotManaged',
'dataColumnsLoaded',
'uiReadStateChange',
'uiColumnTitleRefreshed',
'uiSearchInputChanged',
'uiNewSearchQuery',
'uiSearchInputSubmit',
'uiSearchInputEscaped',
'uiSearchInputFocus',
'uiSearchInputTab',
'uiSearchInputLeft',
'uiSearchInputRight',
'uiSearchInputMoveUp',
'uiSearchInputMoveDown',
'dataUserSearch',
'uiPerformSearch',
'uiShowSearchButtonClick',
'uiAppSearchFocus',
'uiInputBlur',
'uiShowConversationMenu',
'uiInlineComposeTweet',
'uiPopInlineComposeState',
'dataRelationship',
'dataUnfollowActionError',
'dataFollowActionError',
'dataUnblockActionError',
'dataReportActionError',
'dataBlockActionError',
'inlineInstanceTearDown',
'mousedown',
'click',
'dataStreamRate',
'dataCookieOk',
'dataCookieMissing',
'dataCookieMismatch'];

export default ev;