Vendor Tests for Escargot
=========================

# JavaScriptCore
Copied from Webkit master 
- repo: https://github.com/WebKit/webkit.git
- path: Source/JavaScriptCore/tests/

	commit 766c99934048fd2b4b35790e2e619029564f6c45
	Author: commit-queue@webkit.org <commit-queue@webkit.org@268f45cc-cd09-0410-ab3c-d52691b4dbfc>
	Date:   Wed Jul 1 08:55:02 2015 +0000

	   	[Mac] Numerous CGColor leaks in swipe gestures
	    https://bugs.webkit.org/show_bug.cgi?id=146501

	    Patch by Joseph Pecoraro <pecoraro@apple.com> on 2015-07-01
	    Reviewed by Tim Horton.

	    * UIProcess/mac/ViewGestureControllerMac.mm:
    	(WebKit::ViewGestureController::beginSwipeGesture):

# SpiderMonkey
- repo: https://github.com/mozilla/gecko-dev
- path: js/src/test

	commit 790b2cb423ea1ecb5746722d51633caec9bab95a
	Author: Phil Ringnalda <philringnalda@gmail.com>
	Date:   Mon Jan 16 21:42:59 2017 -0800

		Merge m-i to m-c, a=merge

# V8
Copied from V8 tag 5.7.477

- repo: https://github.com/v8/v8.git
- path: test/, tools/testrunner/, tools/run-tests.py

    commit 4b8a39354acd5949f3a389581fe6bda679a4e6d2
    Author: v8-autoroll <v8-autoroll@chromium.org>
    Date:   Mon Jan 16 21:25:22 2017 -0800

        Version 5.7.477

        Performance and stability improvements on all platforms.

# ChakraCore
Copied from ChakraCore release/1.4
- repo: https://github.com/Microsoft/ChakraCore.git
- path: test

    commit 77dd587a536da27c908811fded0adeac2770f1c3
    Merge: 8b9ebcb 8d66b47
    Author: Michael Holman <Michael.Holman@microsoft.com>
    Date:   Tue Jan 17 17:47:15 2017 -0800

        [MERGE #2357 @MikeHolman] add more CopyOnAccessNativeIntArray conversions

            Merge pull request #2357 from MikeHolman:copyonaccess

# JetStream-1.1
Created from Webkit r210797

* JetStream-1.1 directory is created by executing ./create.rb in PerformanceTests/JetStream/

- repo: https://github.com/WebKit/webkit.git
- path: PerformanceTests/JetStream/JetStream-1.1/

# SunSpider
Created from Webkit r210797 (The same version as above JavaScriptCore)

- repo: https://github.com/WebKit/webkit.git
- path: PerformanceTests/SunSpider/


